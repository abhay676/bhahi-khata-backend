/**
 * `routes.js`  defines the routes of the application
 */

const express = require("express");
const router = express.Router();

// Middleware
const auth = require("./middleware/Auth");

// Controllers
const loginController = require("./controller/UserController");
const walletsController = require("./controller/WalletsController");

// LOGIN routes
router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.patch("/user/update/:id", auth, loginController.update);
router.delete("/user/delete/:id", auth, loginController.deleteAcc);
router.post("/user/2fa/:id", auth, loginController.twoFA);
router.get("/user/wallets", auth, loginController.allWallets);

// WALLETS routes
router.post("/api/wallets/add", auth, walletsController.add);
router.patch("/api/wallets/update/:id", auth, walletsController.update);
router.delete("/api/wallets/delete/:id", auth, walletsController.delete);

// EXPENSES routes
module.exports = router;
