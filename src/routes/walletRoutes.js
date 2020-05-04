const router = require("express").Router();

const walletsController = require("../api/controller/WalletsController");
const auth = require("../api/middleware/Auth")

router.post("/api/wallets/add", auth, walletsController.add);
router.patch("/api/wallets/update/:id", auth, walletsController.update);
router.delete("/api/wallets/delete/:id", auth, walletsController.delete);
router.get("/api/wallet/:id", auth, walletsController.getWallet);
router.get("/api/wallets", auth, walletsController.allWallets);
// ? Fetch All expenses for a particular Wallet
router.get("/api/expenses/:walletId", auth, walletsController.walletExpenses);
// Freeze wallet
router.get("/api/freezeWallet/:walletId", auth, walletsController.freezeWallet);

module.exports = router;
