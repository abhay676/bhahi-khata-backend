const mongoose = require("mongoose");
const validator = require("validator");
require("../db");

const budgetSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    amount: {
      type: String,
      required: true,
      validate: {
        validator: function(amt) {
          return validator.isNumeric(amt);
        },
        message: amt => `Invalid budget amount!`
      }
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallets"
    },
    category: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
