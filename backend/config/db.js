const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;


const connectDB = () => {
    try {
        mongoose.connect(uri, {
            useNewUrlParser: true,
        });
        console.log("MongoDB database connection established successfully");
    } catch (error) {
        console.log(error);
    }
}


module.exports = connectDB;

