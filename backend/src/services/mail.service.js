import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config() 

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{   
       user:process.env.TEST_USER,
       pass:process.env.APP_PASS
       
    },
}) 

transporter.verify((err,success)=>{
    if(err){
        console.log("email server not connected",err)
    }
    else{
        console.log("connected to email server")
    }
})

async function sendEmail({to,subject,html,text}) {
   
    try{   

        const info = await transporter.sendMail({
            from:process.env.TEST_USER,
            to,
            subject,
            html,
            text
        })
        
        console.log(info)
        console.log("Message sent successfully",info.messageId)
      
    }
    catch(err){
        console.log("problem occured email failed to send",err)
    }

    return "email sent successfully"
}

export default sendEmail