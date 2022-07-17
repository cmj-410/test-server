/**
 * 维护一个ID自增长表，用户id，角色id
 * 一些递增变量和常量的存储
 */
const mongoose = require("mongoose");
const counterSchema = mongoose.Schema({
  sequence_value: Number,
  original_value: Number,
  roleCount: Number,
  articleCount: Number,
  // 文章关键字列表
  articleAbstractItem: [],
});

module.exports = mongoose.model("counter", counterSchema);
