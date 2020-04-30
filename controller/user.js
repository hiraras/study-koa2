
const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');

const login = async (postData = { username: '', password: '' }) => {
  const username = escape(postData.username);
  // 生成加密密码
  const password = escape(genPassword(postData.password));
  
  const sql = `
    select username, realname from users where username=${username} and password=${password};
  `;
  const result = await exec(sql);
  if (result && result.length) {
    return result[0];
  } else {
    throw new Error('user account not matched');
  }
}

module.exports = {
  login
}
