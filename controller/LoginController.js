const User = require("../model/Auth");
const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

// TODO: req.body is undefined

// GET
exports.login = async (req, res, next) => {
  try {
    console.log(res.body);
    const user = await User.findByEmail({
      email: req.body.email,
      password: req.body.password
    });
    await user.generateToken();
    res.send(user);
  } catch (error) {
    return new Error(error);
  }
};

// POST
exports.register = async (req, res, next) => {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      targetAmt: req.body.targetAmt
    });
    await user.save();
    res.send(generateMsg("success", msg.loginSuccess));
  } catch (error) {
    return new Error(error);
  }
};
