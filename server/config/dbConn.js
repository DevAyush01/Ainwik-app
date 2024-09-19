const mongoose = require("mongoose")

let url = 'mongodb://localhost:27017/ainwik'

module.exports = mongoose.connect(url)