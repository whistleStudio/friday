const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  openid: String,
  nickname: String,
  avatar: Number,
  regDate: {type: Date, defalut: new Date()},
  logDate: Date,
  playtime: Number
})

const User = mongoose.model('users', userSchema)

module.exports = User