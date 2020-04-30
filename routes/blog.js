const router = require('koa-router')();
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require('../controller/blog');

router.prefix('/api/blog');

router.get('/list', async (ctx, next) => {
  const { isAdmin, keyword } = ctx.query;
  let { author } = ctx.query;
  if (isAdmin) {
    author = ctx.session.username;
  }
  try {
    const result = await getList(author, keyword);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(null, err.message);
  }
});

router.get('/detail', async (ctx, next) => {
  const { id } = ctx.query;
  try {
    const result = await getDetail(id);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(null, err.message);
  }
});

router.post('/new', loginCheck, async (ctx, next) => {
  try {
    const body = ctx.request.body;
    body.author = ctx.session.username;
    const result = await newBlog(body);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(null, err.message);
  }
});

router.post('/update', loginCheck, async (ctx, next) => {
  try {
    const body = ctx.request.body;
    body.author = ctx.session.username;
    const result = await updateBlog(body);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(null, err.message);
  }
});

router.delete('/del/:id', loginCheck, async (ctx, next) => {
  try {
    const result = await deleteBlog(ctx.params.id, ctx.session.username);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(null, err.message);
  }
});

module.exports = router;
