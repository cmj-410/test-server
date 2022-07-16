/**
 * 权限
 */

const mongoose = require("mongoose");
const permissionSchema = mongoose.Schema({
  permissionCode: "",
  permissionName: "",
  permissionType: {
    type: String,
    enum: ["menu", "point"],
  },
  parent: "",
  state: {
    type: Number,
    default: 1,
    enum: [0, 1], // 0 停用，1正常
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  }, //更新时间
});

module.exports = mongoose.model("Permission", permissionSchema);
