const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  "userId" : Number,
  "userName": String,
  "userPassword": String,
  "mobile": String,
  "avatar": String,
  "state": {
    type: Number, // 1--正常，0--停用
    default: 1
  },
  "role": [],
  "permission": {"menus": [], "points": []},
  "createTime" : {
    type: Date,
    default: Date.now()
  },//创建时间
  "lastLoginTime" : {
    type: Date,
    default: Date.now()
  }//更新时间
})

module.exports = mongoose.model("user",userSchema)
