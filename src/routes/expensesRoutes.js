const router = require("express").Router();

const expensesController = require("../api/controller/ExpensesController");
const auth = require("../api/middleware/Auth")

router.post("/api/expenses/add", auth, expensesController.add);
router.patch("/api/expenses/update/:id", auth, expensesController.update);
router.delete("/api/expenses/delet/:id", auth, expensesController.delete);
router.get("/api/expense/:id", auth, expensesController.getExpense);

module.exports = router;
