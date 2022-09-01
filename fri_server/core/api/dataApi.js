const express = require('express')
const rt = express.Router()
const User = require("../db/model/User")
const Rank = require("../db/model/Rank")

rt.get("/setNewScore", (req, res) => {
  const {openid, score, nickname} = req.query
  console.log(req.query)
  ;(async () => {
    try {
      let q = await User.findOne({openid}, "score")
      if (q) {
        if (score > q.score) User.updateOne({openid}, {score})
        let rankList = await Rank.find({}).sort("score -regDate")
        if (rankList.length) {
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
          rankList = await Rank.find({}, "nickname score").sort("-score regDate")
          res.json({err:0, rankList})
        } else res.json({err:2, msg:"数据库错误"})
      } else res.json({err:1, msg:"用户不存在"})
    } catch(e){console.log(e); res.json({err: 5})}
  })()
})

module.exports = rt