const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/practice";

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDb", error));

module.exports = mongoose.connection;
