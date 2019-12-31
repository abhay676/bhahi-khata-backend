/**
 * `routes.js`  defines the routes of the application
 */

const express = require("express");
const router = express.Router();

// Controllers
const loginController = require("./controller/AuthController");

// LOGIN routes
router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.patch("/user/update/:id", loginController.update);
router.delete("/user/delete/:id", loginController.deleteAcc);
router.post("/user/2fa/:id", loginController.twoFA);

module.exports = router;
