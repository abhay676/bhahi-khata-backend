const mongoose = require("mongoose");
const validator = require("validator");

const walletsSchema = new mongoose.Schema(
  {
    name: {
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
        message: (amt) => `Invalid wallet amount!`
      }
    },
    currencyType: {
      type: String,
      required: true
    },
    image: {
      type: String
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
    isFreezed: {
      type: Boolean,
      default: false
    },
    inviteLink: {
      type: mongoose.SchemaTypes.String
    }
  },
  { timestamps: true }
);

walletsSchema.methods.walletInfo = function() {
  const wallet = this;
  const walletInfo = wallet.toObject();
  delete walletInfo.userInfo;
  return walletInfo;
};

walletsSchema.set('versionKey', false);

const Wallets = mongoose.model("Wallets", walletsSchema);

module.exports = Wallets;
