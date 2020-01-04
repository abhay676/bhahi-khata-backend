const Expenses = require("../model/Expenses");

const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

// POST
exports.add = async (req, res) => {
  try {
    const walletId = req.body.walletId;
    const expense = new Expenses({ ...req.body, walletId });
    await expense.save();
    res.send(generateMsg(msg.expenseCreateSuccess, "success", expense));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// PATCH
exports.update = async (req, res) => {
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
exports.delete = async (req, res) => {
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
exports.getExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const expense = await Expenses.findById(id);
    if (!expense) throw new Error(msg.expenseAllError);
    res.send(generateMsg(msg.expenseAllSuccess, "success", expense));
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};
