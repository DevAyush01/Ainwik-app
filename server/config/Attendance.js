const mongoose = require('mongoose')

const AttendanceSchema = mongoose.Schema({
    studentName: {
        type: String,
        required: true
      },
    punchIn : {
        type: String,
        default : null
    },

    punchOut : {
        type: String,
        default :null
    },
    totalTime : {
        type: String,
        default : null
    },  
}, {timestamps : true})

module.exports = mongoose.model('Attendance' , AttendanceSchema) 