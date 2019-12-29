const mongooose = require("mongoose");

module.exports = mongooose.connect("mongodb://127.0.0.1:27017/Bhahi-khata", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
