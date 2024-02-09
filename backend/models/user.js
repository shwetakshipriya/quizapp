const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        unique : true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Export User model
module.exports = User;
