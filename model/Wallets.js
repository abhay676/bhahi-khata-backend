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
    icon: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Virtual field of expenses and budget

const Wallets = mongoose.model("Wallets", walletsSchema);

module.exports = Wallets;
