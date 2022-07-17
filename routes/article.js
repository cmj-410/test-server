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
      ctx.body = responses.fail(error.stack, "文章发布失败");
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
      ctx.body = responses.fail(error.stack, "文章更新失败");
    }
  }
});

module.exports = router;
