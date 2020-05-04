const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const logger = require("./utils/Winston");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_API, credentials: true }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes imports
const routes = require("./routes");

app.use("/api", routes);

app.listen(8000, () => {
  logger.info("Server is running on PORT 8000")
});
