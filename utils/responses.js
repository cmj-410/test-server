const constants = require('../constants/stateCode')
module.exports = {
  // 通用响应--成功
  success(data = '', msg = '', code = constants.SUCCESS) {
    console.log('请求成功')
    console.log(data)
    return {
        code, data, msg
    }
},
  // 通用响应--失败
  fail(msg = '', code = constants.BUSINESS_ERROR) {
  console.log('请求失败:', msg)
  console.log(code)
    return {
        code, msg
    }
  }
}