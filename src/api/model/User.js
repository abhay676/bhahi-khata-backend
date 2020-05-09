const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const uniqueId = require("uniqid")
const jwt = require("jsonwebtoken");
const config = require("../../config");
const Gravatar = require("../../services/Gravtar");
const { ErrorHandler } = require("../../services/Handler")

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.String
    },
    avatar: {
      type: mongoose.SchemaTypes.String
    },
    gravatar: {
      type: mongoose.SchemaTypes.String
    },
    firstName: {
      type: mongoose.SchemaTypes.String,
      trim: true,
      required: true
    },
    lastName: {
      type: mongoose.SchemaTypes.String,
      trim: true,
      required: true
    },
    email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function(email) {
          return validator.isEmail(email);
        },
        message: (email) => `Email is not valid`
      }
    },
    mobile: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true,
      validate: {
        validator: function(mobile) {
          return validator.isMobilePhone(mobile);
        },
        message: (msg) => `Invalid mobile number.`
      }
    },
    country: {
      type: mongoose.SchemaTypes.String
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true
    },
    isVerified: {
      type: mongoose.SchemaTypes.Boolean,
      default: false
    },
    budget: {
      amount: {
        type: mongoose.SchemaTypes.Number
      },
      startDate: {
        type: mongoose.SchemaTypes.Date
      },
      endDate: {
        type: mongoose.SchemaTypes.Date
      }
    },
    qrToken: {
      type: mongoose.SchemaTypes.String,
      default: null
    },
    qrCode: {
      type: mongoose.SchemaTypes.String,
      default: null
    },
    wallets: [],
    tokens: [
      {
        token: {
          type: mongoose.SchemaTypes.String,
          required: true
        }
      }
    ],
    meta: {
      source: {
        type: mongoose.SchemaTypes.String
      }
    }
  }, {
    timestamps: true
  }
);

userSchema.pre("save", async function(next) {
  const user = this;
  try {
    if (user.isModified('password')) {
      const pwd = await bcrypt.hash(user.password, 10);
      user.password = pwd;
    }
    user.gravatar = await Gravatar(user.email);
    user.userId = await uniqueId.time()
    next()
  } catch (error) {
    throw new ErrorHandler(error);
  }
  next();
});

userSchema.methods.comparePwd = async function(pwd) {
  const isMatch = await bcrypt.compare(pwd, this.password)
  return isMatch
}

// Generate JWT token
userSchema.methods.generateToken = async function() {
  const user = this;
  const token = await jwt.sign({ _id: user._id.toString() }, config.SECRET_kEY);
  user.tokens = user.tokens.concat({ token });
  await user.save()
  return token
};

userSchema.methods.userInfo = function() {
  const user = this
  const userInfo = user.toObject()
  delete userInfo._id
  delete userInfo.password
  delete userInfo.tokens
  return userInfo
}
userSchema.set('versionKey', false);

const User = mongoose.model("User", userSchema);

module.exports = User;
