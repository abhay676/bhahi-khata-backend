const router = require("express").Router();

const expensesController = require("../api/controller/ExpensesController");
const auth = require("../api/middleware/Auth")

router.post("/expense/add", auth, expensesController.add);
router.patch("/expense/update", auth, expensesController.update);
router.delete("/expenses/delete", auth, expensesController.delete);
router.get("/expense", auth, expensesController.getExpense);
router.get("/expense/all", auth, expensesController.getAllExpenses)

module.exports = router;
