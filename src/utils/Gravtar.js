// export a hash for Gravata
const md5 = require("md5");

module.exports = function generateHash (email) {
  return md5(email);
};
