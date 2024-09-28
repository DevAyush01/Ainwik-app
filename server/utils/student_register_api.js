const express = require("express");
const app = express()
require('../config/dbConn')
const parser = require('body-parser');
const Student = require('../config/StudentRegister');
const jwt = require("jsonwebtoken")
const key = "secretkey";
const bcrypt = require('bcryptjs')
const upload = require('../multerConfig')

app.use(parser.json())
app.use(express.json())



app.post('/register_student',async(req,res)=>{
    const { name, email, phone, studentId , password } = req.body;
    try {
     ``
    let student = await Student.findOne({email})

    if(student){
     res.status(400).json({message: "Student already register"})
    }
      
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);
    
   student = new Student({
     name,
     email,
     phone,
     studentId,
     password : hashedPassword
   })

      await student.save()

     const token = jwt.sign({studentId : student.studentId}, key);

     res.status(201).json({
          message : "Registration successfull",
          token,
          student: {
               name: student.name,
               email: student.email,
               studentId: student.studentId
             }
     })


    } catch (error) {
     // console.log(error.message)
     // res.status(500).json({message : "Something went wrong"})
     console.error('Registration error:', error)
     res.status(500).json({ message: "Registration failed", error: error.message })
    }
}) 

app.post("/login_student",async(req,res)=>{
try {
let {studentId , password} = req.body

const student = await Student.findOne({ studentId }) 

if(!student){
     return res.status(400).json({message : "There is no student with this id"})
}
   
const isMatch = await bcrypt.compare(password, student.password);
if(!isMatch){
     return res.status(400).json({ message: 'Invalid password' });
}

   const token = jwt.sign(
     { studentId: student.studentId, name: student.name },key,
   )

   res.json({
     message: 'Login successful',
     token,
     student: {
       name: student.name,
       email: student.email,
       studentId: student.studentId
     }
   })

   
} catch (error) { 
res.status(500).json({message : "Login failed" })
}
})

module.exports =app