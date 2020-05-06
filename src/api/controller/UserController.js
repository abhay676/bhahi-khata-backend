const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../model/User");
const Wallets = require("../model/Wallets");
const generateMsg = require("../../services/GenerateMsg");
const msg = require("../../services/ToastMsg");
const { ErrorHandler } = require("../../services/ErrorHandler");

exports.register = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    await newUser.generateToken();
    res.send(newUser.userInfo());
  } catch (error) {
    if (!error.code) {
      error.code = 401;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) throw new ErrorHandler(404, "User not found");
    const isMatch = await user.comparePwd(password);
    if (!isMatch) throw new ErrorHandler(404, "Password don't match");
    res.send(user.userInfo());
  } catch (error) {
    error.code = 404;
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true
    });
    res.send({ success: true, code: 200, message: "updated" });
  } catch (error) {
    error.code = 404;
    next(error);
  }
};

// Delete
exports.deleteAcc = async (req, res, next) => {
  try {
    await User.findByIdAndDelete({ _id: req.user });
    res.send({ success: true, code: 200, message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

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
