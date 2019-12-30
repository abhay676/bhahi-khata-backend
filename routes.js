/**
 * `routes.js`  defines the routes of the application
 */

const express = require("express");
const router = express.Router();

// Controllers
const loginController = require("./controller/LoginController");

// LOGIN routes
exports.login = router.post("/login", loginController.login);
exports.register = router.post("/register", loginController.register);
exports.deleteAcc = router.delete("/user/delete", loginController.deleteAcc);

module.exports = router;
