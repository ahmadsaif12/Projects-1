const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require('./data.js');

const mongo_url = 'mongodb://mongo:27017/wanderlust?authSource=admin"';

async function initDb() {
  try {
    await mongoose.connect(mongo_url);
    console.log("MongoDB connected");

    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"695d1fd8332789fe5b0ef059"}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized successfully");

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

initDb();
