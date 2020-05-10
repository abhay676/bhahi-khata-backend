const mongoose = require("mongoose");
const validator = require("validator");
const uniqueId = require("uniqid")
const slug = require("slugify")

const walletsSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.SchemaTypes.String
    },
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
    slug: {
      type: mongoose.SchemaTypes.String
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
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

walletsSchema.pre("save", async function(next) {
  const wallet = this
  wallet.walletId = await uniqueId.time()
  wallet.slug = slug(wallet.name)
  next()
})

walletsSchema.methods.walletInfo = function() {
  const wallet = this;
  const walletInfo = wallet.toObject();
  delete walletInfo.userInfo;
  return walletInfo;
};

walletsSchema.set('versionKey', false);

const Wallets = mongoose.model("Wallets", walletsSchema);

module.exports = Wallets;
