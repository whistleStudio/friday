const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  openid: String,
  nickname: String,
  avatar: Number,
  regDate: {type: Date, defalut: new Date()},
  logDate: Date,
  playtime: Number,
  score: {type:Number, default: 0},
  lvl: {type:Number, default:0},
  lastGameRes: {type:Number, default:-1} //-1新用户0失败1成功
})

const User = mongoose.model('users', userSchema)

module.exports = User