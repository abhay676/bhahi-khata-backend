const Category = require("../model/Category");
const User = require("../model/User");
const { ErrorHandler, Responsehandler } = require("../../services/Handler");

exports.getAllCategory = async (req, res, next) => {
  try {
    const user = req.user;
    const category = await Category.find({ user });
    if (!category) throw new ErrorHandler(404, "No category found");
    res.send(Responsehandler(category));
  } catch (error) {
    error.code = 404;
    next(error);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    const user = req.user;
    const category = new Category({ ...req.body, user });
    const userCategory = await category.save();
    const updatedInfo = await User.findByIdAndUpdate(
      { _id: user },
      { $set: { category: userCategory._id } },
      { new: true }
    );
    res.send(Responsehandler(updatedInfo));
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.query.id;
    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { ...req.body },
      { new: true }
    );
    res.send(Responsehandler(updated));
  } catch (error) {
    error.code = 500;
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.query.id;
    await Category.findOneAndDelete(id);
    await User.findOneAndUpdate(
      { _id: req.user },
      { $unset: { category: null } },
      { new: true }
    );
    res.send(Responsehandler("Deleted"));
  } catch (error) {
    next(error);
  }
};
