const express = require("express")

const userRoutes = require("./userRoutes")
const walletRoutes = require("./walletRoutes")
const expensesRoutes = require("./expensesRoutes")
const filterRoutes = require("./filterRoutes")
const reportRoutes = require("./reportRoutes")
const categoryRoutes = require("./categoryRoutes")

const router = express.Router()

router.use(userRoutes)
router.use(walletRoutes)
router.use(expensesRoutes)
router.use(filterRoutes)
router.use(reportRoutes)
router.use(categoryRoutes)

module.exports = router;
