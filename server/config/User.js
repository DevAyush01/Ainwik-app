const mongoose = require('mongoose')

const ImageGallerySchema = mongoose.Schema({
     
    image : {
        type: String,
        required : true
    },
    heading : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Course', ImageGallerySchema);
