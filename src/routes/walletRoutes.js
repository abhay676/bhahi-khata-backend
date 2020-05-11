const router = require("express").Router();

const walletsController = require("../api/controller/WalletsController");
const auth = require("../api/middleware/Auth")

router.post("/wallet/add", auth, walletsController.add);
router.patch("/wallet/update", auth, walletsController.update);
router.delete("/wallet/delete", auth, walletsController.delete);
router.get("/wallet", auth, walletsController.getWallet);
router.get("/wallet/freeze", auth, walletsController.freezeWallet);
router.get("/wallet/all", auth, walletsController.getAllWallets)

module.exports = router;
