/**
 * `routes.js`  defines the routes of the application
 */

const express = require("express");
const router = express.Router();

// Controllers
const loginController = require("./controller/LoginController");

// LOGIN routes
router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.delete("/user/delete/:id", loginController.deleteAcc);
router.get("/user/2fa/:id", loginController.twoFA);

module.exports = router;
