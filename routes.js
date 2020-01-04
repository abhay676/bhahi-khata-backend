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
const expensesController = require("./controller/ExpensesController");

// LOGIN routes
router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.patch("/user/update/:id", auth, loginController.update);
router.delete("/user/delete/:id", auth, loginController.deleteAcc);
router.post("/user/2fa/:id", auth, loginController.twoFA);
router.get("/user/wallets", auth, loginController.allWallets);
router.get("/user/:id", auth, loginController.getUser);

// WALLETS routes
router.post("/api/wallets/add", auth, walletsController.add);
router.patch("/api/wallets/update/:id", auth, walletsController.update);
router.delete("/api/wallets/delete/:id", auth, walletsController.delete);
router.get("/api/wallet/:id", auth, walletsController.getWallet);
// ? Fetch All expenses for a particular Wallet
router.get("/api/expenses/:walletId", auth, walletsController.walletExpenses);

// EXPENSES routes
router.post("/api/expenses/add", auth, expensesController.add);
router.patch("/api/expenses/update/:id", auth, expensesController.update);
router.delete("/api/expenses/delet/:id", auth, expensesController.delete);
router.get("/api/expense/:id", auth, expensesController.getExpense);

module.exports = router;
