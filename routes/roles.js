const router = require("koa-router")();
const Role = require("../models/roleSchema");
const Counter = require("../models/counterSchema");

const constants = require("../constants/index");
const responses = require("../utils/responses");
const utils = require("../utils/index");
router.prefix("/roles");

// 新增和更新
router.post("/operate", async (ctx) => {
  // permission要求前端根据type放入menu和point的数组中
  const { roleId, roleCode, roleName, permission, action } = ctx.request.body;
  if (action == "add") {
    // 新增必须的字段
    if (!roleCode || !roleName) {
      ctx.body = responses.fail("新建角色-参数错误", constants.PARAM_ERROR);
      return;
    }
    const res = await Role.findOne({ $or: [{ roleCode }, { roleName }] });
    if (res) {
      ctx.body = responses.fail(`系统监测到有重复的角色，请确认角色代码和名称`);
    } else {
      const doc = await Counter.findOneAndUpdate(
        {},
        { $inc: { roleCount: 1 } },
        { new: true }
      );
      try {
        const role = new Role({
          roleId: doc.roleCount,
          roleCode,
          roleName,
          permission,
        });
        role.save();
        ctx.body = responses.success("", "角色创建成功");
      } catch (error) {
        ctx.body = responses.fail(error.stack, "角色创建失败");
      }
    }
  } else {
    // 编辑必须的字段
    if (!roleId) {
      ctx.body = responses.fail("编辑角色-参数错误", constants.PARAM_ERROR);
      return;
    }
    try {
      await Role.findOneAndUpdate({ roleId }, ctx.request.body);
      await Role.findOneAndUpdate({ roleId }, { updateTime: Date.now() });
      ctx.body = responses.success("", "角色信息更新成功");
    } catch (error) {
      ctx.body = responses.fail(error.stack, "角色信息更新失败");
    }
  }
});

// 展示用的角色列表
router.get("/list", async (ctx) => {
  try {
    const list = await Role.find({}, { __v: 0, permission: 0 });
    ctx.body = responses.success(list, "角色列表");
  } catch (error) {
    ctx.body = responses.fail(`查询异常:${error.stack}`);
  }
});

// 角色code和角色名的对象
router.get("/roleMap", async (ctx) => {
  try {
    const list = await Role.find({}, { __v: 0, permission: 0 });
    const resMap = {};
    list.forEach((item) => {
      resMap[item.roleCode] = item.roleName;
    });
    ctx.body = responses.success(resMap, "角色代码和角色名的映射");
  } catch (error) {
    ctx.body = responses.fail(`查询异常:${error.stack}`);
  }
});

// 角色的权限列表
router.get("/rolePermissionsList", async (ctx) => {
  const { roleId } = ctx.request.query;
  try {
    const roleInfo = await Role.findOne({ roleId }, { __v: 0 });
    const temp = roleInfo.permission;
    ctx.body = responses.success(
      { permissionList: [...temp.menus, ...temp.points] },
      `角色${roleId}的权限树`
    );
  } catch (err) {
    ctx.body = responses.fail(err.stack);
  }
});

// 角色删除
router.post("/delete", async (ctx) => {
  const { roleId } = ctx.request.body;
  const res = await Role.deleteOne({ roleId });
  if (res.deletedCount) {
    ctx.body = responses.success(res, `删除成功`);
    return;
  }
  ctx.body = responses.fail("删除失败");
});

module.exports = router;
