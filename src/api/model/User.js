const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const uniqueId = require("uniqid")
const jwt = require("jsonwebtoken");
const msg = require("../../services/ToastMsg");
const config = require("../../config");
const Gravatar = require("../../services/Gravtar");

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
      required: true
    },
    userType: {
      type: mongoose.SchemaTypes.String,
      default: "basic"
    },
    qrToken: {
      type: mongoose.SchemaTypes.String,
      default: null
    },
    createdAt: {
      type: mongoose.SchemaTypes.Number,
      default: Date.now()
    },
    updatedAt: {
      type: mongoose.SchemaTypes.Number,
      default: Date.now()
    },
    qrCode: {
      type: mongoose.SchemaTypes.String,
      default: null
    },
    tokens: [
      {
        token: {
          type: mongoose.SchemaTypes.String,
          required: true
        }
      }
    ]
  }
);

// Wallets virtual field
userSchema.virtual("wallets", {
  ref: "Wallets",
  localField: "_id",
  foreignField: "user"
});

userSchema.pre("save", async function(next) {
  const user = this;
  try {
    const pwd = await bcrypt.hash(user.password, 8);
    user.password = pwd;
    user.gravatar = await Gravatar(user.email);
    user.userId = await uniqueId.time()
  } catch (error) {
    throw new Error(error);
  }
  next();
});

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
  delete userInfo._v
  delete userInfo.tokens
  return userInfo
}
userSchema.set('versionKey', false);

const User = mongoose.model("User", userSchema);

module.exports = User;
