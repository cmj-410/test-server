/**
 * 文章
 */
const mongoose = require("mongoose");
const articleSchema = mongoose.Schema({
  uerId: Number,
  userName: String,
  articleId: Number,
  title: String,
  content: String,
  articleAbstractItem: [],
  articlePermission: {
    type: Boolean,
    default: true,
  },
  createTime: {
    type: Date,
    default: Date.now(),
  }, //创建时间
  lastUpdateTime: {
    type: Date,
    default: Date.now(),
  }, //更新时间
});

module.exports = mongoose.model("article", articleSchema);
