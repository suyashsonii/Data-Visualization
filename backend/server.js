const express = require("express");
const multer = require("multer");
const parseCsv = require("./parsing");
const DataModel = require("../database/DataModel");
const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/practice";

//Server Setup
const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDb", error));

//Middleware Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Parse the uploaded CSV file
    const filePath = req.file.path;
    const parsedData = await parseCsv(filePath);

    // Handle the parsed data (e.g., validate, sanitize, store in database)
    // For demonstration purposes, log the parsed data
    console.log("Parsed CSV data:", parsedData);

    //Insert parsed data into MongoDB
    await DataModel.insertMany(parsedData);

    res.status(200).json({ message: "File uploaded and parsed successfully" });
  } catch (error) {
    console.error("Error parsing CSV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/data", async (req, res) => {
  try {
    // Retrieve data from the MongoDB collection (DataModel)
    const data = await DataModel.find();

    // Check if data exists
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // If data exists, send it as a response
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
