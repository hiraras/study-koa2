const router = require('koa-router')();
router.prefix('/api/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');

router.post('/login', async function(ctx, next) {
  try {
    const result = await login(ctx.request.body);
    const { username, realname } = result;
    ctx.session.username = username;
    ctx.session.realname = realname;
    ctx.body = new SuccessModel({ username, realname });
  } catch(err) {
    ctx.body = new ErrorModel(null, err.message);
  }
});

router.get('/logout', async function(ctx, next) {
  try {
    ctx.session = null;
    ctx.body = new SuccessModel('已登出');
  } catch(err) {
    ctx.body = new ErrorModel(null, err.message);
  }
});

module.exports = router;
