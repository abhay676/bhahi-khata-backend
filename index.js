const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Routes imports
const routes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.listen(8000, () => {
  console.log("Server is running on PORT 8000");
});
