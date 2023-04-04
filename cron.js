const { UserSchema } = require("./src/model/user/User.schema")
const cron=require('node-cron')

const config=require('./src/config/config');
const nodemailer= require('nodemailer')

const sendMailToAllUser = async (emailObj)=>{
const transporter =nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure:false,
    requireTLS:true,
    auth: {
        user:'kbbk34523@gmail.com',
        pass: 'rajuraju',
        method: "PLAIN"
    }
})
try {
    const info = await transporter.sendMail({
        from:"node Project gab lms",
        to:'3abilal3@gmail.com',
        subject:"gab test mail",
        html:"<p>hi this is gab testing mail</p>"
    });
    console.log('Mail has been sent', info);
  } catch (error) {
    if (error.responseCode === 403 && error.response.startsWith('403 Authentication was rate limited.')) {
      console.log('Authentication rate limited, waiting for 56 seconds...');
      await new Promise(resolve => setTimeout(resolve, 56000)); // wait for 56 seconds
      await sendMailToAllUser(emailObj); // try sending the email again
    } else {
      console.error('Error:', error);
    }
  }

transporter.sendMail(info, (error,info)=>{
    if(error){
        console.log(error)
    }
    console.log('mail has been sent',info.response)
})
}



const sendMailAllUser = () =>{
    try {

        cron.schedule('* * * * * *', async () =>{
            console.log("hiii")
            var userData =await UserSchema.find({});
            if(userData.length>0){
                var emails=[]
                userData.map((key)=>{
                    emails.push(key.email);
                })
                sendMailToAllUser(emails)
            }
        })
        
    } catch (error) {
        console.log(error)
    }
}


module.exports={
    sendMailAllUser
}