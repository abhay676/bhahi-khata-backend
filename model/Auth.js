const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const generateMsg = require("../utils/GenerateMsg");
const msg = require("../utils/ToastMsg");

const userSchema = new mongoose.Schema(
  {
    firsName: {
      type: String
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function(email) {
          return validator.isEmail(email);
        },
        message: email => `Email is not valid`
      }
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(mobile) {
          return validator.isMobilePhone(mobile);
        },
        message: msg => `Invalid mobile number.`
      }
    },
    targetAmt: {
      type: String,
      required: true,
      validate: {
        validator: function(amt) {
          return validator.isNumeric(amt, { no_symbols: true });
        },
        message: amt => `Invalid target amount.`
      }
    },
    password: {
      type: String,
      required: true
    },
    secretToken: {
      type: String
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Hashing the password
userSchema.pre("save", async function(next) {
  const user = this;
  try {
    const pwd = await bcrypt.hash(user.password, 8);
    user.password = pwd;
  } catch (error) {
    return new Error(error);
  }
  next();
});

// findByEmail
userSchema.statics.findByEmail = async function(params) {
  try {
    const isValid = await User.findOne({ email: params.email });
    if (isValid) {
      const pwd = await bcrypt.compare(params.password, isValid.password);
      if (pwd) {
        return isValid;
      } else {
        return generateMsg("error", msg.pwdNotMatch);
      }
    }
    return generateMsg("error", msg.userNotFound);
  } catch (error) {
    return new Error(error);
  }
};

// Generate JWT token
userSchema.methods.generateToken = async function() {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.SECRET_KEY
  );
  user.tokens = user.tokens.concat({ token });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
