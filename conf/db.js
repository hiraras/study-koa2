
const env = process.env.NODE_ENV;

let MYSQL_CONF = {};

let REDIS_CONF = {};

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myblog',
    port: '3306'
  }
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  };
}

if (env === 'prod') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myblog',
    port: '3306'
  }
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  };
}

module.exports = {
  port: 3000,
  MYSQL_CONF,
  REDIS_CONF,
}
