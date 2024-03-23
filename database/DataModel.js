const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  column1: String,
  column2: String,
});

const DataModel = mongoose.model("mycsvs", dataSchema);

module.exports = DataModel;
