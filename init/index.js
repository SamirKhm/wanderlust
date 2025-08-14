const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    initDB(); // ✅ Call only once here
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Initialize DB with sample data
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"689430ab95dab60e019e06a7"}))
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data.");
};
