const Wallets = require("../model/Wallets");
const User = require("../model/User");
// const generateMsg = require("../utils/GenerateMsg");
// const msg = require("../utils/ToastMsg");

// ! For creating new wallet
//* POST
exports.add = async (req, res) => {
  const id = req.user._id;
  try {
    const wallet = new Wallets({ ...req.body, user: id });
    wallet.save().then(() => {
      return User.findByIdAndUpdate(id, { activeWallet: wallet._id });
    });
    res.send(wallet);
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// ! For Updating an existing wallet
// PATCH
exports.update = async (req, res) => {
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
exports.delete = async (req, res) => {
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

// ! For fetching expenses
// GET
exports.walletExpenses = async (req, res) => {
  try {
    const walletId = req.params.walletId;
    const expenses = await Wallets.findById(walletId);
    if (!expenses) throw new Error(msg.expenseAllError);
    if (expenses.freeze) {
      return res.send(
        generateMsg(msg.freezeWalletExpense, "error", msg.freezeWalletExpense)
      );
    }
    await expenses.populate("transactions").execPopulate();
    res.send(
      generateMsg(msg.expenseAllSuccess, "success", expenses.transactions)
    );
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// ! For fetching a wallet Info.
// GET
exports.getWallet = async (req, res) => {
  try {
    const id = req.params.id;
    const wallet = await Wallets.find(id);
    if (!wallet) throw new Error(msg.walletsFetchError);
    res.send(generateMsg(msg.walletsFetchSuccess, "success", wallet));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

//! Freeze
// GET
exports.freezeWallet = async (req, res) => {
  try {
    const walletId = req.params.walletId;
    const walletInfo = await Wallets.findById({ _id: walletId });
    if (walletInfo.freeze) {
      return res.send(
        generateMsg(msg.walletFreezeExist, "error", msg.walletFreezeExist)
      );
    }
    const wallet = await Wallets.updateOne(
      { _id: walletId },
      {
        $set: {
          freeze: true,
          active: false
        }
      }
    );
    if (!wallet) throw new Error(msg.walletsFetchError);
    res.send(generateMsg(msg.walletFreeze, "success", wallet));
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
    user
      .populate("wallets")
      .execPopulate()
      .then(wallets => {
        if (wallets.length === 0) {
          res.send(
            generateMsg(msg.walletsFetchSuccess, "success", "No wallets")
          );
        }
        res.send(generateMsg(msg.walletsFetchSuccess, "success", user.wallets));
      });
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};
