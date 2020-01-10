const mongoose = require("mongoose");
const validator = require("validator");
require("../db");

const walletsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: String,
      required: true,
      validate: {
        validator: function(amt) {
          return validator.isNumeric(amt);
        },
        message: amt => `Invalid wallet amount!`
      }
    },
    currencyType: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    budget: {
      type: Number,
      default: null
    },
    reports: [
      {
        type: Object
      }
    ],
    freeze: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

//* Virtual field of expenses

walletsSchema.virtual("transactions", {
  ref: "Expenses",
  localField: "_id",
  foreignField: "walletId"
});

const Wallets = mongoose.model("Wallets", walletsSchema);

module.exports = Wallets;
