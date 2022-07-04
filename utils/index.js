const jwt = require('jsonwebtoken')

const constants = require('../constants/index')

module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum 
   * @param {number} pageSize 
   */
  pager({ pageCurrent = constants.PAGE_CURRENT, pageSize = constants.PAGE_SIZE }) {
    const skipIndex = (+pageCurrent - 1) * pageSize;
    return {
        page: {
          pageCurrent,
          pageSize
        },
        skipIndex
    }
  },
  decoded(authorization) {
    if (authorization) {
        let token = authorization.split(' ')[1]
        return jwt.verify(token, constants.TOKEN_SECRET)
    }
    return '';
  },
}