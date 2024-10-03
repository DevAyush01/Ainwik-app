const mongoose = require('mongoose')

const EmailSchema = mongoose.Schema({
    to: { type: String},
    from: { type: String},
    subject: { type: String},
    text: { type: String},
    html: { type: String},
})

module.exports = mongoose.model('Email', EmailSchema)