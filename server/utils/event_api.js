const express = require('express')
const app = express()

require('../config/dbConn')
const parser = require('body-parser')
const Event = require('../config/Events')
const upload = require('../multerConfig')

app.use(parser.json())
app.use(express.json())

app.get('/hi' , async(req,res)=>{
    res.json({message : "hii"})
})


app.post('/add_event' , async (req,res)=>{
    const {date , time , mode , heading} = req.body

   try {
    let event = await Event.findOne({heading}) 

    if(event){
        res.status(400).json({message: "Event already Happenning!"})
    }

    event = new Event({
        date,
        time,
        mode,
        heading
    })

    await event.save()

    res.status(201).json({
        message : "Event Registered",
        event: {
             date : event.date,
             heading : event.heading
           }
   })


   } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: "Event Registration failed", error: error.message })
   }
})

app.put('/update_event/:id', async (req , res)=>{
    try {
         const {id } = req.params
        const updateData = req.body

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true })

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" })
        }
         
        res.status(200).json({
            message: "Event Updated",
            event: {
                date: updatedEvent.date,
                time: updatedEvent.time,
                mode: updatedEvent.mode,
                heading: updatedEvent.heading
            }
        })

    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({ message: "Event Update failed", error: error.message }) 
    }
})



module.exports = app