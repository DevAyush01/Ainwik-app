const nodemailer = require('nodemailer')
const Email = require('../config/Email')
require('../config/dbConn')

const transporter = nodemailer.createTransport({
    service  : "gmail",
    secure : true , 
    port : 465,
     auth : {
        user : "choudharryayush@gmail.com",
        pass : "efynwpbptevnvavf"
     }
    
})

const reciever = {
    from : "choudharryayush@gmail.com",
    to : "Ayushchoudharry00@gmail.com , cybercafe6006@gmail.com",
    subject : "Node js Mail test!",
    text : "HELLO!",
    html: '<h1>Welcome to Node Mailer</h1><mark>Sending Mails!</mark><h4>Testing</h4>',
}

 transporter.sendMail(reciever , (err, emailResponse)=>{
    if(err){
        console.error('Error Sending Email!' ,err)
    }
 
    console.log("Email Sent Successfully!")

    const emailData = new Email(reciever)
    emailData.save()
    
     
 })

 