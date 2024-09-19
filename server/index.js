const express = require("express");
const app = express()
const port = 2245;
require('./config/dbConn')
const parser = require('body-parser');
const Student = require("./config/user");

app.use(parser.json())
app.use(express.json())




app.listen(port,(err)=>{
    if (err) {
     console.log("Something error")
     
    } else {
     console.log(`server is running on ${port}`)
    }
 })

 app.get('/getData',(req,res)=>{
      res.send("Hello world");
 })

 app.post('/register',async(req,res)=>{
        // const { name, email, phone } = req.body;
        let student = new Student(req.body)
             let result = await student.save();
             result = result.toObject();
             res.send(result)
 })