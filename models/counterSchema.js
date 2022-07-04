/**
 * 维护用户ID自增长表
 */
 const mongoose = require('mongoose')
 const userSchema = mongoose.Schema({
     sequence_value: Number
 })
 
 module.exports = mongoose.model("counter", userSchema)