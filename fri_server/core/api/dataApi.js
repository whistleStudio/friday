const express = require('express')
const rt = express.Router()
const User = require("../db/model/User")
const Rank = require("../db/model/Rank")

rt.get("/setNewScore", (req, res) => {
  const {openid, score, nickname} = req.query
  ;(async () => {
    try {
      let q = User.find({openid}, "score")
      if (q) {
        if (score > q.score) User.updateOne({openid}, {score})
        /* ---------------------- */
        let rankList = Rank.find({}).sort({score: -1, regDate: 1})
        rankList.forEach(e => {
          if (score > e.score) {
            User.create({nickname, score, regDate: new Date()})
            // User.deleteOne
          }
          
        })
        /* ---------------------- */
      } else res.json({err:1})
    } catch(e){console.log(e)}
  })()
})

module.exports = rt