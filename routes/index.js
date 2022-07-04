const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = 'index page'
})

module.exports = router
