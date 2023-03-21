const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ronaldo94@ethereal.email',
        pass: 'HtN3UcVjHuKYKSFd5j'
    }
});


  const send=(info)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let result = await transporter.sendMail(info);
    
      console.log("Message sent: %s", result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            
      resolve(result);
        } catch (error) {
            
        }
    }) 
    }



  const emailProcessor =({email,pin,type})=>{
    let info=''
switch (type) {

  case 'request reset-password':
    info={
      from: '"GAB lms 👻" <ronaldo94@ethereal.email>', // sender address
          to: email, // list of receivers
          subject: "password reset pin ✔", // Subject line
          text: "here in our reset pin ? "+ pin +" expires in 1 day", // plain text body
          html: `<b>password reset </b>
          here is you reset pin 
          <b> ${pin} </b>
          expires in 1 day 
          ` , // html body
  }

  send(info)
    
    break;

    case 'update-password':
      info={
        from: '"GAB lms 👻" <ronaldo94@ethereal.email>', // sender address
            to: email, // list of receivers
            subject: "password updated ✔", // Subject line
            text: "your password has been updated", // plain text body
            html: `<b>password updated </b> ` , // html body
    }
  
    send(info)
      

  default:
    break;
}
  }


   module.exports={
    emailProcessor
   }

  

