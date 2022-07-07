const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const md5 = require('md5')

const User = require('../models/userSchema')
const Counter = require('./../models/counterSchema')

const constants = require('../constants/index')
const responses = require('../utils/responses')
const utils = require('../utils/index')
router.prefix('/users')

router.post('/login', async (ctx, next) => {
  try{
    const { userName, password } = ctx.request.body
    const res = await User.findOne({
      userName,
      password
    }, 'userId userName')
    if(res){
      const data = res._doc
      const token = 'Bearer ' + jwt.sign(
        { data }, 
        constants.TOKEN_SECRET, 
        { expiresIn: constants.TOKEN_TIME }
      )
      data.token = token
      ctx.body = responses.success(data, '登录成功')
      // 更新登录时间
      const profile = await User.findOne({ userId: res.userId })
      profile.lastLoginTime = Date.now()
      profile.save()
    } else{
      ctx.body = responses.fail('账号或密码错误')
    }
  } catch(err){
    ctx.body = responses.fail(err.stack)
  }
})

// 获取登录用户信息和指定用户信息
router.get('/profile', async ctx => {
  const { userId } = ctx.request.query
  try{
    if (!userId){
      let authorization = ctx.request.headers.authorization
      let { data } = utils.decoded(authorization)
      const res = await User.findOne({ userId: data.userId }, {__v: 0, password: 0}) 
      ctx.body = responses.success(res, '个人信息')
    } else {
      const res = await User.findOne({ userId }, {__v: 0, password: 0})
      ctx.body = responses.success(res, `用户${userId}的个人信息`)
    }
  } catch(err){
    ctx.body = responses.fail(err.stack)
  }
})

router.get('/list', async ctx => {
  const { userId, userName, state } = ctx.request.query
  const { page, skipIndex } = utils.pager(ctx.request.query)
  let params = {}
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  if (state) params.state = state
  try {
    const query = User.find(params, {__v: 0})
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)

    ctx.body = responses.success({
      page: {
        ...page,
        total
      },
      list
    },'用户列表（分页）')
  } catch (error) {
    ctx.body = responses.fail(`查询异常:${error.stack}`)
  }
})


// 新增和更新
router.post('/operate', async (ctx) => {
  const { userId, userName, mobile, state, role, action } = ctx.request.body
  if (action == 'add') {
    // 新增必须的字段
    if (!userName || !mobile) {
      ctx.body = responses.fail('新建用户-参数错误', constants.PARAM_ERROR)
      return;
    }
    const res = await User.findOne({ $or: [{ userName }, { mobile }] }, 'userId userName mobile state createTime')
    if (res) {
      ctx.body = responses.fail(`系统监测到有重复的用户，信息如下：
      ${res.userId} - ${res.userName} - ${res.state == 1 ? '正常': '停用'} - ${res.mobile} - ${res.createTime}`)
    } else {
      const doc = await Counter.findOneAndUpdate({}, { $inc: { sequence_value: 1 } }, { new: true })
      try {
        const user = new User({
          userId: doc.sequence_value,
          userName,
          password: md5('123456'),
          mobile,
          role, 
          state,
        })
        user.save()
        ctx.body = responses.success('', '用户创建成功')
      } catch (error) {
        ctx.body = responses.fail(error.stack, '用户创建失败')
      }
    }
  } else {
    // 编辑用户必须的字段
    if (!userId) {
      ctx.body = responses.fail('用户id不能为空', constants.PARAM_ERROR)
      return
    }
    try {
      const res = await User.findOneAndUpdate({ userId }, ctx.request.body)
      ctx.body = responses.success('', '用户信息更新成功')
    } catch (error) {
      ctx.body = responses.fail(error.stack, '用户信息更新失败')
    }
  }
})

// 用户删除/批量删除
router.post('/delete', async (ctx) => {
  // 待删除的用户Id或数组
  const { userId } = ctx.request.body
  const res = await User.deleteOne({ userId}) 
  if (res.deletedCount) {
    ctx.body = responses.success(res, `共删除成功${res.deletedCount}条用户信息`)
    return
  }
  ctx.body = responses.fail('用户删除失败');
})

module.exports = router
