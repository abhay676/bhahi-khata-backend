const express = require("express");

const auth = require("../api/middleware/Auth");
const CategoryController = require("../api/controller/CategoryController");

const router = express.Router();

router.get("/categories", auth, CategoryController.getAllCategory);
router.post("/add/category", auth, CategoryController.addCategory);
router.delete("/category", auth, CategoryController.deleteCategory);

module.exports = router;
