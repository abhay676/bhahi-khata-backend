const Expenses = require("../model/Expenses");
const Wallets = require("../model/Wallets");
const { ErrorHandler, Responsehandler } = require("../../services/Handler");

exports.add = async (req, res, next) => {
  try {
    const id = req.query.id;
    const walletInfo = await Wallets.findOne({ walletId: id });
    if (walletInfo.isFreezed) {
      throw new ErrorHandler(403, "Wallet is freezed");
    }
    const expense = new Expenses({ ...req.body, walletId: id });
    await expense.save();
    res.send(Responsehandler(expense));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.query.id;
    const wId = req.query.wid;
    const expense = await Expenses.findOneAndUpdate(
      { walletId: wId, expenseId: id },
      { ...req.body },
      {
        new: true,
        runValidators: true
      }
    );
    res.send(Responsehandler(expense));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = req.query.id;
    await Expenses.findOneAndDelete({ expenseId: id });
    res.send(Responsehandler("Deleted"));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const id = req.query.id;
    const expense = await Expenses.findById(id);
    if (!expense) throw new ErrorHandler(404, "No expense found");
    res.send(Responsehandler(expense));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const id = req.query.id;
    const expense = await Expenses.find({ walletId: id });
    res.send(Responsehandler(expense));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};
