const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const router = require("koa-router")();
const koajwt = require("koa-jwt");

const index = require("./routes/index");
const users = require("./routes/users");
const roles = require("./routes/roles");
const permissions = require("./routes/permission");
const articles = require("./routes/article");

const constants = require("./constants/index");
const responses = require("./utils/responses");

// error handler
onerror(app);

require("./config/db");

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());

// logger
app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url}`);
  console.log(`get params:${JSON.stringify(ctx.request.query)}`);
  console.log(`post params:${JSON.stringify(ctx.request.body)}`);
  await next().catch((err) => {
    if (err.status == "401") {
      ctx.status = 200;
      ctx.body = responses.fail("Token认证失败", constants.AUTH_ERROR);
    } else {
      throw err;
    }
  });
});

app.use(
  koajwt({ secret: constants.TOKEN_SECRET }).unless({
    path: [/^\/api\/users\/login/],
  })
);

router.prefix("/api");

// routes
router.use(index.routes(), index.allowedMethods());
router.use(users.routes(), users.allowedMethods());
router.use(roles.routes(), roles.allowedMethods());
router.use(permissions.routes(), permissions.allowedMethods());
router.use(articles.routes(), articles.allowedMethods());
app.use(router.routes(), router.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
