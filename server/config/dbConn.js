const mongoose = require("mongoose")
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../..', '.env') });
    
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000, // Increase timeout
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message); // Log the error message
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;
