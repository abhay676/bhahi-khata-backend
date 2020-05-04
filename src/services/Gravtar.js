// export a hash for Gravatar
const crypto = require("crypto");

module.exports = async (email) => {
  const md5Hash = await crypto.createHash("md5").update(email).digest("hex");
  return md5Hash;
};
