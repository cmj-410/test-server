const router = require('koa-router')()
const Power = require('../models/powerSchema')

const constants = require('../constants/index')
const responses = require('../utils/responses')
const { exchange2MenuStructure } = require('../utils/menuStructure')
router.prefix('/permissions')

// 新增和更新
router.post('/operate', async (ctx) => {
  const { permissionCode, permissionName, permissionType, parent, state, action } = ctx.request.body
  if (action == 'add') {
    // 新增必须的字段
    if (!permissionCode || !permissionName || !permissionType) {
      ctx.body = responses.fail('新建权限-参数错误', constants.PARAM_ERROR)
      return;
    }
    const res = await Power.findOne({ $or: [{ permissionCode }, { permissionName }] })
    if (res) {
      ctx.body = responses.fail(`系统监测到有重复的权限`)
    } else {
      try {
        const power = new Power({
          permissionCode,
          permissionName,
          permissionType,
          parent: parent ?? '',
          state: state
        })
        power.save()
        ctx.body = responses.success('', '权限创建成功')
      } catch (error) {
        ctx.body = responses.fail(error.stack, '权限创建失败')
      }
    }
  } else {
    // 编辑必须的字段
    if (!permissionCode) {
      ctx.body = responses.fail('编辑权限-参数错误', constants.PARAM_ERROR)
      return
    }
    try {
      const res = await Power.findOneAndUpdate({ permissionCode }, ctx.request.body)
      ctx.body = responses.success('', '角色信息更新成功')
    } catch (error) {
      ctx.body = responses.fail(error.stack, '角色信息更新失败')
    }
  }
})

router.get('/list', async ctx => {
  try {
    const originalData = await Power.find({}, {'_v': 0})
    const temp = JSON.parse(JSON.stringify(originalData))
  // const temp = Array.from(list)
    const res = []
    originalData.forEach(item => {
      const node = JSON.parse(JSON.stringify(item))
      if (item.parent){
        temp.every(x => {
          if(x.permissionCode == item.parent){
            if(x.children){
              x.children.push(node)
            } else{
              x.children = [ node ]
            }
            return false
          }
          return true
        })
      } else {
        res.push(node)
      }
    })
    // const powerList = exchange2MenuStructure(originalData)
    ctx.body = responses.success(res,'菜单结构')
  } catch (error) {
    ctx.body = responses.fail(`菜单查询异常:${error.stack}`)
  }
})

// 角色详情信息
router.get('/detail', async ctx => {
  const { roleId } = ctx.request.query
  try{
    const res = await Role.findOne({ roleId }, {__v: 0})
    ctx.body = responses.success(res, `角色${roleId}的详细信息`)
  } catch(err){
    ctx.body = responses.fail(err.stack)
  }
})

// 角色删除
router.post('/delete', async (ctx) => {
  const { roleId } = ctx.request.body
  const res = await Role.deleteOne({ roleId}) 
  if (res.deletedCount) {
    ctx.body = responses.success(res, `删除成功`)
    return
  }
  ctx.body = responses.fail('删除失败');
})

module.exports = router
