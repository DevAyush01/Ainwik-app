const express = require('express');
const connectDB = require('../config/dbConn');
const Attendance = require('../config/Attendance');
const moment = require('moment-timezone');
const wifi = require('node-wifi');

const app = express();
app.use(express.json());
connectDB();

const isCloudEnvironment = process.env.IS_CLOUD_ENVIRONMENT === 'true';

wifi.init({ iface: null });

const formatDateTime = (isoString) => {
    return moment(isoString).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
};

const calculateTimeDifference = (start, end) => {
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes`;
};


const checkWifiConnection = () => {
  if (isCloudEnvironment) {
    // Skip WiFi check in cloud environment
    return Promise.resolve(true); // Assume connected for cloud environment
}

  return new Promise((resolve, reject) => {
      wifi.getCurrentConnections((error, currentConnections) => {
          if (error) {
              console.error('Error getting WiFi connections:', error);
              return reject(error);
          }

          console.log('Current WiFi Connections:', currentConnections);
          currentConnections.forEach(connection => {
              console.log('Detected SSID:', connection.ssid);
              console.log('Detected BSSID:', connection.bssid);
          });

          // Check if connected to AinwikConnect using BSSID
          const isConnected = currentConnections.some(connection => 
              connection.bssid && connection.bssid.trim() === 'AinwikConnect'
          );

          console.log('Is connected to AinwikConnect:', isConnected);
          resolve(isConnected);
      });
  });
};

app.get('/check-wifi', async (req, res) => {
    try {
        const isConnected = await checkWifiConnection();
        const allConnections = await new Promise((resolve, reject) => {
            wifi.getCurrentConnections((error, connections) => {
                if (error) reject(error);
                else resolve(connections);
            });
        });

        res.json({
            isConnected,
            allConnections,
            message: isConnected ? 'Connected to AinwikConnect' : 'Not connected to AinwikConnect'
        });
    } catch (error) {
        console.error('Error checking WiFi connection:', error);
        res.status(500).json({ message: 'Failed to check WiFi connection', error: error.message });
    }
});

app.post('/punchin', async (req, res) => {
    const { studentName } = req.body;

    if (!studentName) {
        return res.status(400).json({ message: "Student name is required" });
    }

    try {
        const isConnected = await checkWifiConnection();
        if (!isConnected) {
            return res.status(403).json({ message: "You must be connected to the AinwikConnect WiFi to punch in" });
        }

        const punchInTime = new Date();
        const attendance = new Attendance({ studentName, punchIn: punchInTime });

        await attendance.save();
        res.status(201).json({ ...attendance.toObject(), punchIn: formatDateTime(punchInTime) });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/punchout', async (req, res) => {
    const { studentName } = req.body;

    if (!studentName) {
        return res.status(400).json({ message: "Student name is required." });
    }

    try {
        const isConnected = await checkWifiConnection();
        if (!isConnected) {
            return res.status(403).json({ message: "You must be connected to the AinwikConnect WiFi to punch out" });
        }

        const punchOutTime = new Date();
        const attendance = await Attendance.findOne({ studentName, punchOut: null });

        if (!attendance) {
            return res.status(404).json({ message: "No Punch In Attendance Found!" });
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
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/attendance', async (req, res) => {
    try {
        const attendances = await Attendance.find().sort({ punchIn: -1 });
        const formattedAttendances = attendances.map(record => ({
            studentName: record.studentName,
            punchIn: formatDateTime(record.punchIn),
            punchOut: record.punchOut ? formatDateTime(record.punchOut) : 'N/A',
            totalTime: record.totalTime || 'N/A'
        }));

        res.status(200).json(formattedAttendances);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ message: 'Failed to fetch attendance records', error: error.message });
    }
});

module.exports = app;