const router = require("express").Router();

const filterController = require("../api/controller/FilterController");
const auth = require("../api/middleware/Auth");

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

module.exports = router;
