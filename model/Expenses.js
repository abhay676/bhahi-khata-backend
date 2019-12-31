const mongoose = require("mongoose");
const validator = require("validator");
require("../db");
const msg = require("../utils/ToastMsg");

// TODO: expenseSchema is `NOT READY`
/**
 * Store Country and Currency by the help of ipgeolocation API `Free tier`
 * For User image, we can use robohash for creating robo-type type as default
 * Validate mobile number by using veriphone API `Free-tier`
 * Providing short URL for joining Bhahi-khata
 */

const ObjectId = mongoose.Schema.Types.ObjectId;
const expenseSchema = new mongoose.Schema({
  merchantName: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return validator.isISO8601(date);
      },
      message: props => `Date is not valid!`
    },
    amount: {
      type: String,
      required: true,
      validate: {
        validator: function(amt) {
          return validator.isNumeric(amt);
        },
        message: amt => `Not a valid type!`
      }
    },
    currencyType: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: null
    },
    event: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    user: {
      type: ObjectId
    }
  }
});

// Define Mongoose hooks and Custom function here.

const Expenses = mongoose.model("Expenses", expenseSchema);

module.exports = Expenses;
