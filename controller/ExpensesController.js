const Expenses = require("../model/Expenses");
const Wallets = require("../model/Wallets");
const User = require("../model/User");

const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

// POST
exports.add = async (req, res, next) => {
  try {
    const walletID = req.body.walletId;
    const expense = new Expenses({ ...req.body });
    expense.save().then(docDocument => {
      return Wallets.findByIdAndUpdate(
        walletID,
        { $push: { expenses: docDocument._id } },
        { new: true }
      );
    });
    res.send(generateMsg(msg.expenseCreateSuccess, "success", expense));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// PATCH
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const expense = await Expenses.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    res.send(generateMsg(msg.expenseUpdateSuccess, "success", expense));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// DELETE
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Expenses.findByIdAndDelete(id);
    res.send(
      generateMsg(
        msg.expenseDeletedSuccess,
        "success",
        msg.expenseDeletedSuccess
      )
    );
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// GET
exports.all = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    console.log(user);
    if (!user) throw new Error(msg.userNotFound);
    const expenses = await Expenses.find({
      walletId: {
        $eq: user.activeWallet
      }
    });
    res.send(generateMsg(msg.expenseAllSuccess, "success", expenses));
  } catch (error) {
    res.send(null, "error", error);
  }
};
