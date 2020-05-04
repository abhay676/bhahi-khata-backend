const router = require("express").Router();

const ReportController = require("../api/controller/ReportController");

const auth = require("../api/middleware/Auth");

router.get("/api/gnReport/:walletId", auth, ReportController.generatePDF);
module.exports = router;
