const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config({ path: "./config/config.env" });

const User = require("../models/userModel");

//Connect to database
mongoose.connect(process.env.MONGO_URI, {});

//Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userData.json`, "utf-8")
);

//Import into DB
const importData = async () => {
  try {
    await User.create(users);

    console.log("Data Imported...".yellow.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//Delete Data
const deleteData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Deleted...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
