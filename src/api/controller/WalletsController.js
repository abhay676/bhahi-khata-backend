const Wallets = require("../model/Wallets");
const { ErrorHandler, Responsehandler } = require("../../services/Handler");

exports.add = async (req, res, next) => {
  try {
    const wallet = new Wallets({ ...req.body, user: req.user });
    await wallet.save();
    res.send(Responsehandler(wallet.walletInfo()));
  } catch (error) {
    error.code = 403;
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const id = req.query.id;
  try {
    const wallet = await Wallets.findOneAndUpdate(
      { walletId: id },
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
  try {
    await Wallets.find({ walletId: id });
    res.send(Responsehandler("Deleted"));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};

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
    await Wallets.updateOne(
      { walletId: id },
      {
        $set: {
          isFreezed: true
        }
      }
    );
    res.send(Responsehandler("Wallet freezed successfully"));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};

exports.getAllWallets = async (req, res, next) => {
  try {
    const wallet = await Wallets.find({ user: req.user });
    res.send(Responsehandler(wallet));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};
