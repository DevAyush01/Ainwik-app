const mongoose = require('mongoose')

const VideoSchema = mongoose.Schema({
       
    title : { type : String },
    description : {type :  String  },
    uploadDate : { type: Date , default : Date.now },
    filename : { type : String },
    contentType : { type : String },
    length : {type : Number },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },

})

module.exports = mongoose.model('Videos', VideoSchema)