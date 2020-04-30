
const crypto = require('crypto');
const SECRET_KEY = 'Wfjie_fjFIE5E6';

function md5(content) {
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}

function genPassword(psw) {
  return md5(`${psw}${SECRET_KEY}`);
}

module.exports = {
  genPassword
}
