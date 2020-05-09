const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true
    },
    isCustom: {
      type: mongoose.SchemaTypes.Boolean,
      default: false
    },
    isEditable: {
      type: mongoose.SchemaTypes.Boolean,
      default: false
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    },
    position: {
      type: mongoose.SchemaTypes.Number
    }
  },
  { timestamps: true }
);

categorySchema.set('versionKey', false);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
