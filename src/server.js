const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan")

const logger = require("./utils/Winston");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_API, credentials: true }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"))

// Routes imports
const routes = require("./routes");

app.use("/api", routes);

app.listen(8000, () => {
  logger.info("Server is running on PORT 8000")
});
