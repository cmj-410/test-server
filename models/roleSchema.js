const mongoose = require('mongoose')
const roleSchema = mongoose.Schema({
  "roleId": Number,
  "roleCode": String,
  "roleName": String,
  "permission": {"menus": [], "points": []},
  "updateTime" : {
    type: Date,
    default: Date.now()
  }//更新时间
})

module.exports = mongoose.model("Role",roleSchema)
