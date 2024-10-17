const express = require('express')
const connectDB = require('../config/dbConn');
const Attendance = require('../config/Attendance')
const moment = require('moment-timezone');
const wifi= require('node-wifi')

const app = express();
app.use(express.json());
connectDB()

wifi.init({
  iface : null
})

const formatDateTime = (isoString) => {
  return moment(isoString).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
}

  const calculateTimeDifference = (start, end) => {
    const diff = end - start; // difference in milliseconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes`;
  };

  const checkWifiConnection = ()=>{
    return new Promise((resolve , reject)=>{
    wifi.getCurrentConnections((error, currentConnections)=>{
      if (error) {
        console.log('Error getting wifi connection: ', error)
        reject(error)
      } else {
        console.log('Current Connections:', JSON.stringify(currentConnections, null, 2))
        const ainwikWifi = currentConnections.find(connection => 
          connection.ssid === 'connected' && (connection.bssid === 'AinwikConnect' || connection.mac === 'AinwikConnect')
        )
        console.log('AinwikConnect WiFi found:', ainwikWifi ? 'Yes' : 'No')
        if (ainwikWifi) {
          console.log('AinwikConnect details:', JSON.stringify(ainwikWifi, null, 2))
        }
        resolve(!!ainwikWifi)
      }
    })
    })
  }

  app.get('/check-wifi', async (req,res)=>{
    try {
      const isConnected = await checkWifiConnection()
      const allConnections = await new Promise((resolve, reject) => {
        wifi.getCurrentConnections((error, connections) => {
          if (error) reject(error)
          else resolve(connections)
        })
      })
      res.json({
        isConnected,
        allConnections,
        message: isConnected ? 'Connected to AinwikConnect' : 'Not connected to AinwikConnect'
      })
    } catch (error) {
      console.error('Error checking WiFi connection:', error)
      res.status(500).json({ message: 'Failed to check WiFi connection', error: error.message })
    }
  })
  

app.post('/punchin', async (req,res)=>{
   const {studentName} = req.body

   if (!studentName) {
    return res.status(400).json({ message: "Student name is required" });
  }

  try {
     
    const isConnected = await checkWifiConnection()

    if(!isConnected){
      return res.status(403).json({ message: "You must be connected to the Ainwik Infotech WiFi to punch in" })
    }

  const punchInTime = new Date()


   const attendance = new Attendance({
    studentName,
    punchIn : punchInTime,
   })

    
        await attendance.save()
        res.status(201).json({...attendance.toObject(),punchIn:  formatDateTime(punchInTime)})

    } catch (error) {
        res.status(400).json({message : error.message})
    }
})


app.post('/punchout', async (req,res)=>{
   
    const {studentName} = req.body;

    if (!studentName) {
      return res.status(400).json({ message: "Student name is required." });
  }

  try {
    const isConnected = await checkWifiConnection()
    if (!isConnected) {
      return res.status(403).json({ message: "You must be connected to the Ainwik Infotech WiFi to punch out" })
    }

    const punchOutTime = new Date()
          
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

  app.get('/attendance', async (req, res) => {
    try {
      const attendances = await Attendance.find().sort({ punchIn: -1 })
      
      const formattedAttendances = attendances.map(record => ({
        studentName: record.studentName,
        punchIn: formatDateTime(record.punchIn),
        punchOut: record.punchOut ? formatDateTime(record.punchOut) : 'N/A',
        totalTime: record.totalTime || 'N/A'
      }))
  
      res.status(200).json(formattedAttendances)
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      res.status(500).json({ message: 'Failed to fetch attendance records', error: error.message })
    }
  })

module.exports = app