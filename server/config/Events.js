const mongoose = require('mongoose')

const EventsSchema = mongoose.Schema({
    date : {
        type : String
    },
    time : {
        type : String
    },
    mode : {
        type : String
    },
    heading : {
        type : String
    } 
})

module.exports = mongoose.model('Event' , EventsSchema)