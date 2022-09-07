const express = require('express')
const rt = express.Router()
const User = require("../db/model/User")
const Rank = require("../db/model/Rank")

rt.get("/setNewScore", (req, res) => {
  let {openid, score, nickname, lastGameRes} = req.query
  score = Number(score); lastGameRes = Number(lastGameRes)
  console.log(req.query)
  ;(async () => {
    try {
      let q = await User.findOne({openid}, "score")
      if (q) {
        if (score > q.score) {await User.updateOne({openid}, {score, lastGameRes})}
        else await User.updateOne({openid}, {lastGameRes})
        let rankList = await Rank.find({}).sort("score -regDate")
        if (rankList.length==10) {
          try {
            rankList.forEach(e => {
              if (score > e.score) {
                throw "ranklist renew"
              }
            })
          } catch (renew) {
            await Rank.deleteOne({regDate: rankList[0].regDate})
            await Rank.create({nickname, score, regDate: new Date()})
          }
          res.json({err:0})
        } else {console.log("setNewScore: rankL error");res.json({err: 5, msg:"数据请求错误"})}
      } else {console.log("setNewScore: player not found");res.json({err:5, msg:"数据请求错误"})}
    } catch(e){console.log(e); res.json({err: 5, msg:"数据请求错误"})}
  })()
})

rt.get("/getRankList", (req, res) => {
  ;(async () => {
    let rankList = await Rank.find({}, "nickname score").sort("-score regDate")
    console.log("rankL---", rankList.length)
    if (rankList.length==10) res.json({err:0, rankList})
    else {console.log("getRankList error");res.json({err:5, msg:"数据请求错误"})}
  })()
})

module.exports = rt