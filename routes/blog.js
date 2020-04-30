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

router.get('/list', loginCheck, async (ctx, next) => {
  const { isAdmin, keyword } = ctx.request.query;
  let { author } = ctx.request.query;
  if (isAdmin) {
    author = ctx.session.username;
  }
  try {
    const result = await getList(author, keyword);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(err);
  }
});

router.get('/detail', loginCheck, async (ctx, next) => {
  const { id } = ctx.request.query;
  try {
    const result = await getDetail(id);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(err);
  }
});

router.post('/new', loginCheck, async (ctx, next) => {
  try {
    ctx.request.body.author = ctx.session.username;
    const result = await newBlog(ctx.request.body);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    console.log(err)
    ctx.body = new ErrorModel(err);
  }
});

router.post('/update', loginCheck, async (ctx, next) => {
  try {
    ctx.request.body.author = ctx.session.username;
    const result = await updateBlog(ctx.request.body);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(err);
  }
});

router.delete('/del/:id', loginCheck, async (ctx, next) => {
  try {
    const result = await deleteBlog(ctx.params.id, ctx.session.username);
    ctx.body = new SuccessModel(result);
  } catch(err) {
    ctx.body = new ErrorModel(err);
  }
});

module.exports = router;
