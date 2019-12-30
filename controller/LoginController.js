const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../model/Auth");
const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

// TODO: req.body is undefined

//! Constroller for login an existing user
// GET
exports.login = async (req, res, next) => {
  try {
    console.log(res.body);
    const user = await User.findByEmail({
      email: req.body.email,
      password: req.body.password
    });
    await user.generateToken();
    res.send(user);
  } catch (error) {
    return generateMsg("ERROR", "error", 401, error);
  }
};

//! Controller for New User
// POST
exports.register = async (req, res, next) => {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      targetAmt: req.body.targetAmt
    });
    await user.save();
    res.send(generateMsg("SUCCESS", "success", 200, msg.loginSuccess));
  } catch (error) {
    return generateMsg("ERROR", "error", 401, error);
  }
};

//! Controller for deleting/removing account of an user
// Delete //TODO: NOT Completed YET
exports.deleteAcc = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const user = await User.findByIdAndDelete();
  } catch (error) {}
};

//! For 2-Factor-Authentication
exports.twoFA = async (req, res, next) => {
  const id = req.params.id;
  let imageUrl;
  const secret = speakeasy.generateSecret({ length: 20 });
  qrcode.toDataURL(secret.base32, function(err, image) {
    if (err) {
      return generateMsg("ERROR", "error", 401, err);
    }
    imageUrl = image;
  });
  const user = await User.findByIdAndUpdate(
    id,
    { secretToken: secret },
    { new: true }
  );
  if (!user) return generateMsg("NOT FOUND", "error", 401, msg.userNotFound);
  return { user, imageUrl };
};
