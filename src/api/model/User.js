const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const msg = require("../../services/ToastMsg");
const config = require("../../config")

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String
    },
    firstName: {
      type: String,
      trim: true,
      required: true
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
    password: {
      type: String,
      required: true
    },
    userType: {
      type: String
    },
    qrToken: {
      type: String,
      default: null
    },
    qrCode: {
      type: String,
      default: null
    },
    token: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Wallets virtual field
userSchema.virtual("wallets", {
  ref: "Wallets",
  localField: "_id",
  foreignField: "user"
});

// Hashing the password
userSchema.pre("save", async function(next) {
  const user = this;
  try {
    const pwd = await bcrypt.hash(user.password, 8);
    user.password = pwd;
  } catch (error) {
    throw new Error(error);
  }
  next();
});

// findByEmail
userSchema.statics.findByEmail = async function(email, password) {
  try {
    const isValid = await User.findOne({ email });
    if (isValid) {
      const pwd = await bcrypt.compare(password, isValid.password);
      if (pwd) {
        return isValid;
      } else {
        throw new Error(msg.pwdNotMatch);
      }
    }
    throw new Error(msg.userNotFound);
  } catch (error) {
    throw new Error(error);
  }
};

// Generate JWT token
userSchema.methods.generateToken = async function() {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    config.SECRET_kEY
  );
  user.token = token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
