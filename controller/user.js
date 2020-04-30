
const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');

const login = (postData = { username: '', password: '' }) => {
  const username = escape(postData.username);
  // 生成加密密码
  const password = escape(genPassword(postData.password));
  
  const sql = `
    select username, realname from users where username=${username} and password=${password};
  `;
  return exec(sql).then(result => {
    if (result && result.length) {
      return Promise.resolve(result[0]);
    } else {
      return Promise.reject('user account not matched');
    }
  });
}

module.exports = {
  login
}
