const mongoose = require("mongoose");
const validator = require("validator");
require("../db");

const expensesSchema = new mongoose.Schema(
  {
    merchantName: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true,
      validate: {
        validator: function(amt) {
          return validator.isNumeric(amt);
        },
        message: amt => `Invalid expense amount!`
      }
    },
    event: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    date: {
      type: Date
    },
    description: {
      type: String
    },
    category: {
      type: String,
      required: true
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallets"
    }
  },
  {
    timestamps: true
  }
);

const Expenses = mongoose.model("Expenses", expensesSchema);

module.exports = Expenses;
