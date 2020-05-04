const mongoose = require("mongoose");
const validator = require("validator");

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
    userDate: {
      type: Date,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    category: {
      type: String,
      required: true
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Expenses = mongoose.model("Expenses", expensesSchema);

module.exports = Expenses;
