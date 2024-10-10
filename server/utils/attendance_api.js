const express = require('express')
const connectDB = require('../config/dbConn');
const Attendance = require('../config/Attendance')


const app = express();
app.use(express.json());
connectDB()


const formatDateTime = (date) => {
    return date.toISOString();
  };

// const formatDateTime = (date) => {
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

  const calculateTimeDifference = (start, end) => {
    const diff = end - start; // difference in milliseconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes`;
  };
  
  const { zonedTimeToUtc } = require('date-fns-tz');

app.post('/punchin', async (req,res)=>{
   const {studentName} = req.body

   if (!studentName) {
    return res.status(400).json({ message: "Student name is required" });
  }

  const punchInTime = zonedTimeToUtc(new Date(), 'Asia/Kolkata');  


   const attendance = new Attendance({
    studentName,
    punchIn : punchInTime,
   })

    try {
        await attendance.save()
        res.status(201).json({...attendance.toObject(),punchIn: punchInTime.toISOString(),})

    } catch (error) {
        res.status(400).json({message : error.message})
    }
})


app.post('/punchout', async (req,res)=>{
   
    const {studentName} = req.body;

    const punchOutTime = new Date()

    try {
          
        const attendance = await Attendance.findOne({studentName , punchOut : null})
        if(!attendance){
            return res.status(404).json({message : "No Punch In Attendance Found!"})
        }

        const punchInDate = new Date(attendance.punchIn);
        const totalTime = calculateTimeDifference(punchInDate, punchOutTime);

        attendance.punchOut = punchOutTime;
        attendance.totalTime = totalTime;

        await attendance.save();

        res.status(200).json({
            ...attendance.toObject(),
      punchIn: formatDateTime(attendance.punchIn),
      punchOut: formatDateTime(punchOutTime)
        })


    } catch (error) {
        res.status(400).json({ message: error.message });
    }

})


app.get('/totaltime/:studentName', async (req, res) => {
    const { studentName } = req.params;
  
    try {
      const attendances = await Attendance.find({ studentName, totalTime: { $ne: null } });
      
      let totalMinutes = 0;
      attendances.forEach(record => {
        const [hours, minutes] = record.totalTime.split(' hours ');
        totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
      });
  
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      const totalTime = `${totalHours.toString().padStart(2, '0')} hours ${remainingMinutes.toString().padStart(2, '0')} minutes`;
      
      res.status(200).json({ 
        studentName, 
        totalTime
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = app