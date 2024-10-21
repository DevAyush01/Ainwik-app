const mongoose = require('mongoose')

const AttendanceSchema = mongoose.Schema({
    studentName: { type: String, required: true  },
    
    punchIn : { type: Date, default : null },

    punchOut : {  type: Date, default :null   },

    totalTime : { type: String,  default : null }, 

    latitude: { type: Number, required: true },

    longitude: { type: Number, required: true },
   
    punchOutLatitude: { type: Number },
   
    punchOutLongitude: { type: Number },

    status : { type : String, enum: ['Present', 'Absent', 'Half Day'], default: 'Absent'}

}, {timestamps : true})

module.exports = mongoose.model('Attendance' , AttendanceSchema) 