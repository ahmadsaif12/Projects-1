const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require('./data.js');

const mongo_url = 'mongodb://mongo:27017/wanderlust';

async function initDb() {
  try {
    await mongoose.connect(mongo_url);
    console.log("MongoDB connected");

    await Listing.deleteMany({});

    await Listing.insertMany(initData.data);
    console.log("Database initialized successfully");

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

initDb();
