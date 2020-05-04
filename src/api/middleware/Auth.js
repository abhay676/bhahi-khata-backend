const jwt = require("jsonwebtoken");
const generateMsg = require("../../utils/GenerateMsg");
const msg = require("../../utils/ToastMsg");

module.exports = async (req, res, next) => {
  const bearerHeader =
    req.headers["x-access-token"] || req.headers.authorization;
  if (!bearerHeader) {
    return res.send(generateMsg("Permission error", "error", msg.accessDenied));
  }
  try {
    const token = bearerHeader.replace("Bearer ", "");
    const verify = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = verify;
    next();
  } catch (error) {
    res.send(generateMsg("Permission error", "error", error));
  }
};
