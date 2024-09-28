const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    phone:{
        type: Number
    },
    studentId:{
        unique : true,
        type: String,
    },
    password:{
        type:String
    }
})


module.exports = mongoose.model('Students',UserSchema)
