const express = require('express')
const rt = express.Router()
const User = require("../db/model/User")
const Rank = require("../db/model/Rank")

rt.get("/setNewScore", (req, res) => {
  const {openid, score} = req.query
  ;(async () => {
    try {
      let q = User.find({openid}, "nickname score")
      if (q) {
        if (score > q.score) User.updateOne({openid}, {score})
        let rankList = Rank.find({}).sort("rank")
        rankList.forEach(e => {
          // if (score>)
        })

      } else res.json({err:1})
    } catch(e){console.log(e)}
  })()
})

module.exports = rt