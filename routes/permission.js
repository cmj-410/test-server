const router = require("koa-router")();
const Power = require("../models/powerSchema");
const Role = require("../models/roleSchema");

const constants = require("../constants/index");
const responses = require("../utils/responses");
const { exchange2MenuStructure } = require("../utils/menuStructure");
router.prefix("/permissions");

// 新增权限
router.post("/add-permission", async (ctx) => {
  const { permissionCode, permissionName, permissionType, parent, state } =
    ctx.request.body;
  if (
    !(permissionCode?.length > 0) ||
    !(permissionName?.length > 0) ||
    !(permissionType?.length > 0)
  ) {
    ctx.body = responses.fail("新建权限-参数错误", constants.PARAM_ERROR);
    return;
  }
  const res = await Power.findOne({
    $or: [{ permissionCode }, { permissionName }],
  });
  if (res) {
    ctx.body = responses.fail(`系统监测到有重复的权限`);
  } else {
    try {
      const power = new Power({
        permissionCode,
        permissionName,
        permissionType,
        parent,
        state,
      });
      power.save();
      ctx.body = responses.success("", "权限创建成功");
    } catch (error) {
      ctx.body = responses.fail(error.stack);
    }
  }
});

// 完整的权限列表
router.get("/all-list", async (ctx) => {
  try {
    const originalData = await Power.find({}, { _v: 0 });
    const powerList = exchange2MenuStructure(originalData);
    ctx.body = responses.success(powerList, "菜单结构");
  } catch (error) {
    ctx.body = responses.fail(`菜单查询异常:${error.stack}`);
  }
});

// 权限删除
router.post("/delete-permission", async (ctx) => {
  const { permissionCode } = ctx.request.body;
  const res = await Power.deleteOne({ permissionCode });
  if (res.deletedCount) {
    ctx.body = responses.success(res, `权限删除成功`);
    return;
  }
  ctx.body = responses.fail("权限删除失败");
});

// 关闭/开启某权限
// 关闭所有角色的菜单需求/权限点需求
router.post("/close-permission", async (ctx) => {
  const { permissionCode, state } = ctx.request.body;
  if (!permissionCode || ![0, 1].includes(state)) {
    ctx.body = responses.fail("修改权限状态参数错误");
  } else {
    await Power.findOneAndUpdate({ permissionCode }, { state });
    ctx.body = responses.success("", "修改权限状态成功");
  }
});

module.exports = router;
