const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../model/User");
const Wallets = require("../model/Wallets");
const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

//! Controller for New User
// POST
exports.register = async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password
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
exports.login = async (req, res) => {
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
exports.update = async (req, res) => {
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
exports.deleteAcc = async (req, res) => {
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
exports.twoFA = async (req, res) => {
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

//! For Fetching all Wallets associated to that user
// GET
exports.allWallets = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    if (!user) throw new Error(msg.userNotFound);
    await user.populate("wallets").execPopulate();
    res.send(generateMsg(msg.walletsFetchSuccess, "success", user.wallets));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

//! For getting user info
//  GET
exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    const userDetails = Object.assign({}, user);
    const userInfo = userDetails._doc; // * for getting the new object

    // * Delete tokens and password
    delete userInfo.password;
    delete userInfo.token;
    delete userInfo.qrToken;

    // * Fetching all wallets
    const wallet = await Wallets.find({
      user: userInfo._id,
      active: true
    });

    const activeWallet = wallet[0];

    res.send(
      generateMsg(msg.userFetchSuccess, "success", { userInfo, activeWallet })
    );
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};
