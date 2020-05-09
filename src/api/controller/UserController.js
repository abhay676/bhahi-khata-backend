const speakeasy = require("speakeasy"); //! On-hold ( has to be reviewd again )
const qrcode = require("qrcode"); //! On-hold ( has to be reviewed again )
const User = require("../model/User");
const { ErrorHandler, Responsehandler } = require("../../services/Handler");

exports.register = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    await newUser.generateToken();
    res.send(Responsehandler(newUser.userInfo()));
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
    await user.generateToken();
    res.send(Responsehandler(user.userInfo()));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = req.body;
    await User.findByIdAndUpdate(req.user, data, {
      new: true,
      runValidators: true,
    });
    res.send(Responsehandler("Updated"));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};

// Delete
exports.deleteAcc = async (req, res, next) => {
  try {
    await User.findByIdAndDelete({ _id: req.user });
    res.send(Responsehandler("Deleted"));
  } catch (error) {
    next(error);
  }
};

// exports.twoFA = async (req, res) => {
//   const id = req.params.id;
//   const secret = speakeasy.generateSecret({ length: 20 });
//   try {
//     const image = await qrcode.toDataURL(secret.base32);
//     if (!image) {
//     }
//     const user = await User.findByIdAndUpdate(
//       id,
//       { secretToken: secret.base32, qrCode: image },
//       { new: true }
//     );
//     if (!user) throw new Error(msg.userNotFound);
//     res.send(generateMsg(msg.qrCodeSuccess, "success", user));
//   } catch (error) {
//     res.send(generateMsg(null, "error", error));
//   }
// };

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    res.send(Responsehandler(user.userInfo()));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};
