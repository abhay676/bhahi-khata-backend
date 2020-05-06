const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("./db");

const logger = require("./services/Winston");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_API, credentials: true }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

// Routes imports
const routes = require("./routes");

app.use("/api", routes);

app.use(function(err, req, res, next) {
  if (err.code === 11000 || err.code === 11001) {
    res
      .status(404)
      .send({
        success: false,
        code: err.code,
        error: "Email is already registered"
      });
  }
  res
    .status(err.code)
    .send({ success: false, code: err.code, error: err.message });
});

app.listen(8000, () => {
  logger.info("Server is running on PORT 8000");
});
