const mongoose = require('mongoose')

const EventsSchema = mongoose.Schema({
    name :{
        type : String
    },
    course : {
        type : String
    }
})

module.exports = mongoose.model('Certificate' , EventsSchema)