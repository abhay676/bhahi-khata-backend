const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../model/Auth");
const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

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
    await user.generateToken();
    await user.save();
    res.send(generateMsg(msg.loginSuccess, "success", user));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

//! Controller for login an existing user
// POST
exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByEmail(email, password);
    res.send(user);
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

//! Controller for updating User info
// PATCH
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) throw new Error(msg.userNotFound);
    res.send(generateMsg(msg.userUpdateSuccess, "success", user));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

//! Controller for deleting/removing account of an user
// Delete
exports.deleteAcc = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete({ _id: id });
    if (!user) throw new Error(msg.userNotFound);
    res.send(
      generateMsg(msg.userDeleteSuccess, "success", msg.userDeleteSuccess)
    );
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

//! For 2-Factor-Authentication
exports.twoFA = async (req, res, next) => {
  const id = req.params.id;
  const secret = speakeasy.generateSecret({ length: 20 });
  try {
    const image = await qrcode.toDataURL(secret.base32);
    if (!image) {
    }
    const user = await User.findByIdAndUpdate(
      id,
      { secretToken: secret.base32, qrCode: image },
      { new: true }
    );
    if (!user) throw new Error(msg.userNotFound);
    res.send(generateMsg(msg.qrCodeSuccess, "success", user));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};
