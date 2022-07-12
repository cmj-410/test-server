/**
 * 维护一个ID自增长表，用户id，角色id
 */
 const mongoose = require('mongoose')
 const counterSchema = mongoose.Schema({
     sequence_value: Number,
     original_value: Number,
     roleCount: Number
 })
 
 module.exports = mongoose.model("counter", counterSchema)