const express = require('express');
const app = express();
const parser = require('body-parser');
const path = require('path');
const coursesapp = require('./utils/courses_api');
const Slider = require('./utils/slider_api')
const StudentRegister = require('./utils/student_register_api')
const Event = require('./utils/event_api')
const Certificate = require('./utils/certificate_api')
const authRoutes = require('./routes/admin_api')
const razorpay = require('./utils/razor_pay')
const Attendance = require('./utils/attendance_api')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const cors = require('cors');
app.use(cors())

require('./config/dbConn');


app.use(parser.json());

const port = process.env.PORT || 4455;

const uploadDir = path.join(__dirname, '../uploads');
app.use('//uploads', express.static(uploadDir));

app.use('/api', razorpay)

app.use('/api/auth',authRoutes)
app.use('/api',coursesapp)
app.use('/api',Slider)
app.use('/api',StudentRegister)
app.use('/api',Event)
app.use('/api' , Certificate)
app.use('/api', Attendance)


app.listen(port, (err) => {
    if (err) {
        console.log("Something went wrong", err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
}); 

console.log('JWT Secret:', process.env.JWT_SECRET);

app.get('/', (req,res)=>{
    res.json({message : "Hello"})
})



 