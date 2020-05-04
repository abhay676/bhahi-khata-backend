const express = require("express")

const loginRoutes = require("./loginRoutes")
const walletRoutes = require("./walletRoutes")
const expensesRoutes = require("./walletRoutes")
const filterRoutes = require("./filterRoutes")
const reportRoutes = require("./reportRoutes")

const router = express.Router()

router.use(loginRoutes)
router.use(walletRoutes)
router.use(expensesRoutes)
router.use(filterRoutes)
router.use(reportRoutes)

module.exports = router;
