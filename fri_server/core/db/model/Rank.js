const mongoose = require("mongoose")

const rankSchema = new mongoose.Schema({
  // rank: Number,
  nickname: {type: String, default: "-"},
  score: {type: Number, default: -999},
  regDate: {type: Date, default: new Date()}
})

const Rank = mongoose.model("ranks", rankSchema)

module.exports = Rank