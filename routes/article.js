const router = require("koa-router")();

const constants = require("../constants/index");
const responses = require("../utils/responses");

const Article = require("../models/articleSchema");
const Counter = require("../models/counterSchema");
router.prefix("/article");

// 新增和更新
router.post("/operate", async (ctx) => {
  const {
    userId,
    userName,
    articleId,
    title,
    content,
    articleAbstractItem,
    articlePermission,
    action,
  } = ctx.request.body;
  if (action == "add") {
    // 新增必须的字段
    if (
      !userName ||
      !userId ||
      !title ||
      !content ||
      !articleAbstractItem ||
      ![true, false].includes(articlePermission)
    ) {
      ctx.body = responses.fail("文章发布失败-参数错误", constants.PARAM_ERROR);
      return;
    }
    const doc = await Counter.findOneAndUpdate(
      {},
      { $inc: { articleCount: 1 } },
      { new: true }
    );
    try {
      const article = new Article({
        articleId: doc.articleCount,
        userId,
        userName,
        title,
        content,
        articleAbstractItem,
        articlePermission,
      });
      article.save((err) => {
        if (err) console.log(err);
      });
      ctx.body = responses.success("", "文章发布成功");
    } catch (error) {
      ctx.body = responses.fail(error.stack);
    }
  } else {
    // 编辑用户必须的字段
    if (!articleId) {
      ctx.body = responses.fail("文章id为空", constants.PARAM_ERROR);
      return;
    }
    try {
      await Article.findOneAndUpdate({ articleId }, ctx.request.body);
      ctx.body = responses.success("", "文章更新成功");
    } catch (error) {
      ctx.body = responses.fail(error.stack);
    }
  }
});

// 获取所有文章类型
router.get("/getAll-article-type", async (ctx) => {
  try {
    const res = await Counter.findOne({}, { articleAbstractItem: 1, _id: 0 });
    ctx.body = responses.success(res.articleAbstractItem, "获取所有文章类型");
  } catch (err) {
    ctx.body = responses.fail(error.stack);
  }
});

// 获取某类型的文章列表（一次三个,先这么干，count为请求的次数）
router.get("/type-article-list", async (ctx) => {
  const { type, count } = ctx.request.query;
  if (!type || !count) {
    ctx.body = responses.fail("参数类型错误", constants.PARAM_ERROR);
  } else {
    try {
      const query = Article.find(
        { articleAbstractItem: type },
        { _id: 0, __v: 0 }
      );
      const list = await query.skip(count * 3).limit(3);
      ctx.body = responses.success(list);
    } catch (err) {
      ctx.body = responses.fail(error.stack);
    }
  }
});

module.exports = router;
