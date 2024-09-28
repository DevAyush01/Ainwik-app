const mongoose = require('mongoose')

const SliderSchema = mongoose.Schema({
    images : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Slider', SliderSchema)