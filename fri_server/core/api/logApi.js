const express = require('express')
const rt = express.Router()
const User = require("../db/model/User")
const APPID = "wx9aa61faf9cdefdf8", APPSECRET = "3b480d6c25f9acb8152333459b1d072f"
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

rt.get("/getOpenid", (req, res) => {
  let {code} = req.query
  try {
    fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`)
    .then(rs => rs.json()
    .then(data => res.json({err:0, ...data}))).catch(e=>console.log(code, "getOpenid error"))
  } catch(e){console.log(e);res.json({err:5, msg: "server error"})}
})

rt.get("/getUserInfo", (req, res) => {
  let {openid} = req.query
  ;(async ()=>{
    try {
      let doc = await User.findOne({openid})
      if (doc) {
        User.updateOne({openid}, {logDate: new Date()})
        let {nickname, avatar, lvl, lastGameRes} = doc
        res.json({err:0, nickname, avatar, lvl, lastGameRes})
      } else res.json({err:1})
    } catch (e){console.log(e);res.json({err:5, msg: "server error"})}
  })()
})

rt.get("/setUser", (req, res) => {
  let {nickname, openid} = req.query
  console.log("--setUser--")
  ;(async ()=>{
    try {
      let avatar = 2+parseInt(Math.random()*23)
      await User.create({nickname, openid, avatar, createDate: new Date(), logDate: new Date()})
      res.json({err:0, nickname, avatar})
    } catch(e){console.log(e);res.json({err:5, msg: "server error"})}
  })()
  // res.json({err:0})
})

module.exports = rt