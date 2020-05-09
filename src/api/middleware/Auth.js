const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../../services/Handler")

module.exports = async (req, res, next) => {
  const bearerHeader =
    req.headers["x-access-token"] || req.headers.authorization;
  if (!bearerHeader) {
    throw new ErrorHandler(401, "Token is not found")
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
