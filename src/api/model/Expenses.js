const mongoose = require("mongoose");
const validator = require("validator");

const expensesSchema = new mongoose.Schema(
  {
    title: {
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
        message: (amt) => `Invalid expense amount!`
      }
    },
    event: {
      type: String,
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
  { timestamps: true }
);

expensesSchema.set('versionKey', false);

const Expenses = mongoose.model("Expenses", expensesSchema);

module.exports = Expenses;
