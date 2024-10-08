const express = require('express')
const Razorpay = require('razorpay')
const path = require('path');
const shortid = require('shortid')
const bodyParser = require('body-parser');
const crypto = require('crypto')
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '../..', '.env') });
const app = express()

app.use(express.json())


app.use(cors())
app.use(bodyParser.json())

var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret : process.env.RAZORPAY_SECRET_KEY
})

app.post('/verification' , (req,res)=>{
    const secret = "razorpaysecret"

    console.log(req.body)

    const shasum = crypto.createHmac("sha256", secret)
    shasum.update(JSON.stringify(req.body));
    const digest= shasum.digest("hex")

    console.log(digest , req.headers["x-razorpay-signature"])

    if(digest=== req.headers["x-razorpay-signature"]){
        console.log("request is legit")
        res.status(200).json({message : "OK"})
    }else{
        res.status(403).json({message : "Invalid"})
    }

})

app.post('/razorpay', async (req,res)=>{
       const payment_capture = 1;
       const amount = 500;
       const currency = "INR";
        
    
        const options = {
            amount,
            currency,
            receipt : shortid.generate(),
            payment_capture,
        }


    try {
        const response = await razorpay.orders.create(options)
       console.log(response)

       res.status(200).json({
        id : response.id,
        currency : response.currency,
        amount : response.amount
       })
    } catch (error) {
        console.error("Razorpay API Error:", error);
        res.status(500).json({ error: "Failed to create Razorpay order", details: error.message });
        
    }
    
        
})

module.exports =app