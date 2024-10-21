const express = require('express');
const connectDB = require('../config/dbConn');
const Attendance = require('../config/Attendance');
const moment = require('moment-timezone');
const { verifyToken } = require('../middleware/auth');

const app = express();
app.use(express.json());
connectDB();

// Configuration for allowed geolocation range
const ALLOWED_LATITUDE = 28.4731; // Ainwik Infotech, Greater Noida latitude
const ALLOWED_LONGITUDE = 77.5150; // Ainwik Infotech, Greater Noida longitude
const ALLOWED_RADIUS = 4; // 0.5 km radius

const formatDateTime = (isoString) => {
    return moment(isoString).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
};

const calculateTimeDifference = (start, end) => {
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes`;
};

const isWithinAllowedRange = (latitude, longitude) =>{
    const R = 6371;
    const dLat = (latitude - ALLOWED_LATITUDE) * Math.PI / 180
    const dLon = (longitude - ALLOWED_LONGITUDE) * Math.PI / 180
    const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) + 
    Math.cos(ALLOWED_LATITUDE * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c ;
    return distance <= ALLOWED_RADIUS
}

app.post('/punchin', async (req, res) => {
    const { studentName, latitude, longitude } = req.body;

    if (!studentName || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: "Student name and location are required" });
    }

    console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);

    if (!isWithinAllowedRange(latitude, longitude)) {
        return res.status(403).json({ message: "You are not within the allowed range to punch in" });
    }

    try {
    
        const punchInTime = new Date();
        let status = 'Half Day'
        const punchInMoment = moment(punchInTime)

        const startTime = punchInMoment.clone().set({hour : 10 , minute : 0 , second: 0})
        const endTime = punchInMoment.clone().set({hour : 10 , minute : 30 , second : 0})

        if(punchInMoment.isBetween(startTime , endTime , null , [])){
            status = 'Present'
        }else{
            status= 'Half Day'
        }
        
        const attendance = new Attendance({ studentName, punchIn: punchInTime ,latitude, longitude , status});

        await attendance.save();
        res.status(201).json({ ...attendance.toObject(), punchIn: formatDateTime(punchInTime) });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/punchout', async (req, res) => {
    const { studentName, latitude, longitude } = req.body;

    if (!studentName || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: "Student name and location are required" });
    }

    if (!isWithinAllowedRange(latitude, longitude)) {
        return res.status(403).json({ message: "You are not within the allowed range to punch out" });
    }

    try {

        const punchOutTime = new Date();
        const attendance = await Attendance.findOne({ studentName, punchOut: null });

        if (!attendance) {
            return res.status(404).json({ message: "No Punch In Attendance Found!" });
        }

        const punchInDate = new Date(attendance.punchIn);
        const totalTime = calculateTimeDifference(punchInDate, punchOutTime);
        attendance.punchOut = punchOutTime;
        attendance.totalTime = totalTime;
        attendance.punchOutLatitude = latitude;
        attendance.punchOutLongitude = longitude;

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
            id: record._id,
            studentName: record.studentName,
            punchIn: formatDateTime(record.punchIn),
            punchOut: record.punchOut ? formatDateTime(record.punchOut) : 'N/A',
            totalTime: record.totalTime || 'N/A',
            status: record.status || 'N/A',
            punchInLocation: record.latitude && record.longitude ? 
                `${record.latitude.toFixed(4)}, ${record.longitude.toFixed(4)}` : 'N/A',
            punchOutLocation: record.punchOutLatitude && record.punchOutLongitude ? 
                `${record.punchOutLatitude.toFixed(4)}, ${record.punchOutLongitude.toFixed(4)}` : 'N/A'
        }));

        res.status(200).json(formattedAttendances);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ message: 'Failed to fetch attendance records', error: error.message });
    }
});

app.put('/attendance/:id/status', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Present', 'Absent', 'Half Day'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'Present', 'Absent', or 'Half Day'" });
        }

        const updatedAttendance = await Attendance.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.json({
            id: updatedAttendance._id,
            studentName: updatedAttendance.studentName,
            status: updatedAttendance.status,
            punchIn: formatDateTime(updatedAttendance.punchIn),
            punchOut: updatedAttendance.punchOut ? formatDateTime(updatedAttendance.punchOut) : 'N/A',
            totalTime: updatedAttendance.totalTime || 'N/A',
            punchInLocation: updatedAttendance.latitude && updatedAttendance.longitude ? 
                `${updatedAttendance.latitude.toFixed(4)}, ${updatedAttendance.longitude.toFixed(4)}` : 'N/A',
            punchOutLocation: updatedAttendance.punchOutLatitude && updatedAttendance.punchOutLongitude ? 
                `${updatedAttendance.punchOutLatitude.toFixed(4)}, ${updatedAttendance.punchOutLongitude.toFixed(4)}` : 'N/A'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/attendance/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAttendance = await Attendance.findByIdAndDelete(id);

        if (!deletedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.json({
            message: `Successfully deleted attendance record`,
            deletedRecord: {
                id: deletedAttendance._id,
                studentName: deletedAttendance.studentName,
                punchIn: formatDateTime(deletedAttendance.punchIn),
                punchOut: deletedAttendance.punchOut ? formatDateTime(deletedAttendance.punchOut) : 'N/A',
                status: deletedAttendance.status
            }
        });
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        res.status(500).json({ message: 'Failed to delete attendance record', error: error.message });
    }
});



module.exports = app;