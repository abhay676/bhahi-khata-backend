const jwt = require("jsonwebtoken");
const generateMsg = require("../../services/GenerateMsg");
const msg = require("../../services/ToastMsg");

module.exports = async (req, res, next) => {
  const bearerHeader =
    req.headers["x-access-token"] || req.headers.authorization;
  if (!bearerHeader) {
    return res.send(generateMsg("Permission error", "error", msg.accessDenied));
  }
  try {
    const token = bearerHeader.replace("Bearer ", "");
    const verify = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = verify._id;
    next();
  } catch (error) {
    res
      .status(403)
      .send({ success: false, code: 403, error: "Permission denied" });
  }
};
