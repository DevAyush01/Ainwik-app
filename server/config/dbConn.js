const mongoose = require("mongoose")

let MONGO_URL = 'mongodb+srv://choudharryayush:Sa6YuubHuYCWOsPS@mymongodb.g9twt.mongodb.net/mymongodb?retryWrites=true&w=majority&appName=mymongodb'
    
module.exports = mongoose.connect(MONGO_URL)

