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
      { $addField: { category: userCategory } }
    );
    res.send(Responsehandler(updatedInfo));
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.query.id;
    const user = req.user;
    await Category.findOneAndDelete(id);
    await User.findByIdAndUpdate(user, { category: {} });
    res.send(Responsehandler("Deleted"));
  } catch (error) {
    next(error);
  }
};
