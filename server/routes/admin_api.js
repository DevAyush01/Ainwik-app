const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../config/Admin');


const app = express();

app.post('/register_admin' ,async(req , res)=>{
    try {
        const {username , password , confirmPassword} = req.body

        if(password !== confirmPassword){
            return res.status(400).send({message : "Password do not Match!"})
        }

        const existingAdmin = await Admin.findOne({username})
        if(existingAdmin){
            return res.status(400).send({message : "Admin already exist!"})
        }

        const hashedPassword = await bcrypt.hash(password, 15)

        const newAdmin = new Admin({
            username,
            password : hashedPassword
        })

  
        await newAdmin.save()


        res.status(201).send({ message: 'Admin registered successfully' });


    } catch (error) {
        res.status(500).send({ message: 'Error registering admin', error: error.message });
        
    }
})

app.post('/login_admin', async (req,res) =>{
    try {
        const  {username ,password }= req.body

        const admin = await Admin.findOne({username})
 
        if(!Admin){
            return res.status(404).send({message : "Admin not found!"})
        }
        
        const isPasswordValid = await bcrypt.compare(password , admin.password)

        if(!isPasswordValid){
            return res.status(401).send({auth : false , token : null , message  : 'Invalid Password'})
        }

        const token = jwt.sign({id : admin._id }, process.env.JWT_SECRET, {expiresIn : '24h'})

        res.status(200).send({ auth: true, token: token });

    } catch (error) {
        res.status(500).send({ message: 'Error on the server.', error: error.message });   
    }
})

module.exports = app