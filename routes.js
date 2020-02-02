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
const filterController = require("./controller/FilterController");
const ReportController = require("./controller/ReportController");

// ! LOGIN routes
router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.patch("/user/update/:id", auth, loginController.update);
router.delete("/user/delete/:id", auth, loginController.deleteAcc);
router.post("/user/2fa/:id", auth, loginController.twoFA);
router.get("/user/:id", auth, loginController.getUser);

// ! WALLETS routes
router.post("/api/wallets/add", auth, walletsController.add);
router.patch("/api/wallets/update/:id", auth, walletsController.update);
router.delete("/api/wallets/delete/:id", auth, walletsController.delete);
router.get("/api/wallet/:id", auth, walletsController.getWallet);
router.get("/api/wallets", auth, walletsController.allWallets);

// ? Fetch All expenses for a particular Wallet
router.get("/api/expenses/:walletId", auth, walletsController.walletExpenses);
// Freeze wallet
router.get("/api/freezeWallet/:walletId", auth, walletsController.freezeWallet);

// ! EXPENSES routes
router.post("/api/expenses/add", auth, expensesController.add);
router.patch("/api/expenses/update/:id", auth, expensesController.update);
router.delete("/api/expenses/delet/:id", auth, expensesController.delete);
router.get("/api/expense/:id", auth, expensesController.getExpense);

// ? Filter routes
router.get(
  "/api/expenses/filter/:walletId",
  auth,
  filterController.sortExpenses
);
router.get(
  "/api/expenses/search/:walletId",
  auth,
  filterController.searchExpenses
);

// Report Generation
router.get("/api/gnReport/:walletId", auth, ReportController.generatePDF);

module.exports = router;
