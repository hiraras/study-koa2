const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const RedisStore = require('ioredis-koa')
const session = require('koa-generic-session')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog');
const user = require('./routes/user');
const { REDIS_CONF } = require('./conf/db');
const fs = require('fs');
const path = require('path');
const morgan = require('koa-morgan');
const logFilePath = path.join(__dirname, './logs', './assess.log');
const logWriteStream = fs.createWriteStream(logFilePath, {
  flags: 'a'
});

function getLogFormat() {
  const env = process.env.NODE_ENV;
  if (env === 'dev') {
    return 'dev';
  }
  if (env === 'prod') {
    return 'combined';
  }
}

app.use(morgan(getLogFormat(), {
  stream: logWriteStream
}));

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  console.log(1)
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const redisStore = RedisStore({
  port: REDIS_CONF.port,          // Redis port
  host: REDIS_CONF.host,   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
})
app.keys = ['JfEEFIKfLjjie_21342J_feji']
app.use(session({
  store: redisStore,
  cookie: {
    path: '/',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true
  }
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
