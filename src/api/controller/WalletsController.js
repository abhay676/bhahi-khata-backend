const Wallets = require("../model/Wallets");
const User = require("../model/User");
const { ErrorHandler, Responsehandler } = require("../../services/Handler");

exports.add = async (req, res, next) => {
  const id = req.user;
  try {
    const wallet = new Wallets({ ...req.body });
    await User.findById(req.user);
    wallet.save().then((data) => {
      res.send(Responsehandler(data));
      return User.findByIdAndUpdate(id, {
        $push: { wallets: data },
      });
    });
  } catch (error) {
    error.code = 403;
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const id = req.query.id;
  try {
    const wallet = await Wallets.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.send(Responsehandler(wallet.walletInfo()));
  } catch (error) {
    error.code = 403;
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const id = req.query.id;
  console.log("id: ", req.user)
  try {
    const d = await Wallets.findByIdAndDelete(id);
    const user = await User.findById(req.user)
    console.log(user)
    res.send(Responsehandler("Deleted"));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};

// exports.walletExpenses = async (req, res) => {
//   try {
//     const walletId = req.params.walletId;
//     const expenses = await Wallets.findById(walletId);
//     if (!expenses) throw new Error(msg.expenseAllError);
//     if (expenses.freeze) {
//         generateMsg(msg.freezeWalletExpense, "error", msg.freezeWalletExpense)
//       return res.send(
//       );
//     }
//     await expenses.populate("transactions").execPopulate();
//     res.send(
//       generateMsg(msg.expenseAllSuccess, "success", expenses.transactions)
//     );
//   } catch (error) {
//     res.send(generateMsg(null, "error", error));
//   }
// };

exports.getWallet = async (req, res, next) => {
  try {
    const id = req.query.id;
    const wallet = await Wallets.findById(id);
    if (!wallet) throw new ErrorHandler(404, "No wallet found");
    res.send(Responsehandler(wallet.walletInfo()));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};

exports.freezeWallet = async (req, res, next) => {
  try {
    const walletId = req.query.id;
    const walletInfo = await Wallets.findById({ _id: walletId });
    if (walletInfo.freeze) {
      return res.send(Responsehandler("Already freezed"));
    }
    const wallet = await Wallets.updateOne(
      { _id: walletId },
      {
        $set: {
          freeze: true,
        },
      }
    );
    if (!wallet) throw new ErrorHandler(404, "No wallet found");
    res.send(Responsehandler("Wallet freezed successfully"));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};
