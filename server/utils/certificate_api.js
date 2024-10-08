const express = require('express')
const app = express()

const connectDB = require('../config/dbConn');
const parser = require('body-parser')
const Certificate = require('../config/Certificate')
const upload = require('../multerConfig')
connectDB(); 

app.use(parser.json())
app.use(express.json())

app.post('/add_certificate', async (req,res)=>{
    const {name , course} = req.body

    try {
       
      const  certificate = new Certificate({
            name,
            course
        })
    
        await certificate.save()
    
        res.status(201).json({
            message : "Successfully Applied for certificate!",
            certificate: {
                id : certificate._id,
                name : certificate.name,
                cousrse : certificate.course
               }
       })
    
    
       } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: "Error ", error: error.message })
       }


})


app.delete('/delete_certificate/:id', async (req, res) => {
    try {
        const deletedCertificate = await Certificate.findByIdAndDelete(req.params.id);
        
        if (!deletedCertificate) {
            return res.status(404).send('Certificate not found');
        }

        res.json({
            message: 'Certificate deleted successfully',
            certificate: {
                name : deletedCertificate.name,
                course : deletedCertificate.course
            }

        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting certificate');
    }
});


module.exports = app

