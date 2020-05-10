const Wallets = require("../model/Wallets");
const User = require("../model/User");
const { ErrorHandler, Responsehandler } = require("../../services/Handler");

exports.add = async (req, res, next) => {
  const id = req.user;
  try {
    const wallet = new Wallets({ ...req.body, user: req.user });
    wallet.save().then((data) => {
      res.send(Responsehandler(data));
      return User.findByIdAndUpdate(id, {
        $push: { wallets: data }
      });
    });
  } catch (error) {
    error.code = 403;
    next(error);
  }
};

// Not a good approach
exports.update = async (req, res, next) => {
  const id = req.query.id;
  try {
    const wallet = await Wallets.findOneAndUpdate(
      { walletId: id },
      { ...req.body },
      { new: true }
    );
    // First remove the object
    await User.findByIdAndUpdate(
      req.user,
      { $pull: { wallets: { walletId: id } } },
      { new: true }
    );
    // Added the updated object
    await User.findByIdAndUpdate(
      req.user,
      { $push: { wallets: wallet } },
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
  try {
    await Wallets.find({ walletId: id });
    await User.findByIdAndUpdate(
      req.user,
      { $pull: { wallets: { walletId: id } } },
      { new: true }
    );
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
    const id = req.query.id;
    const walletInfo = await Wallets.findOne({ walletId: id });
    if (walletInfo.isFreezed) {
      return res.send(Responsehandler("Wallet is already freezed"));
    }
    const wallet = await Wallets.updateOne(
      { walletId: id },
      {
        $set: {
          isFreezed: true
        }
      }
    );
    await User.updateOne(
      { _id: req.user, "wallets.walletId": id },
      { $set: { "wallets.$.isFreezed": true } }
    );
    if (!wallet) throw new ErrorHandler(404, "No wallet found");
    res.send(Responsehandler("Wallet freezed successfully"));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};
