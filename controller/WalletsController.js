const Wallets = require("../model/Wallets");
const User = require("../model/User");
const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

// ! For creating new wallet
// POST
exports.add = async (req, res, next) => {
  const id = req.user._id;
  try {
    const wallet = new Wallets({ ...req.body, user: id });
    wallet.save().then(document => {
      return User.findByIdAndUpdate(id, { activeWallet: wallet._id });
    });
    res.send(wallet);
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// ! For Updating an existing wallet
// PATCH
exports.update = async (req, res, next) => {
  const id = req.params.id;
  try {
    const wallet = await Wallets.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.send(generateMsg(msg.walletUpdateSuccess, "success", wallet));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// ! For Deleting a wallet
// DELETE
exports.delete = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Wallets.findByIdAndDelete(id);
    res.send(
      generateMsg(msg.walletDeleteSuccess, "success", msg.walletDeleteSuccess)
    );
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};
