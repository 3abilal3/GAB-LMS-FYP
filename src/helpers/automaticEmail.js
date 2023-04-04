const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'your_email@example.com',
        pass: 'your_password'
    }
});

// define email options
let mailOptions = {
    from: 'your_email@example.com',
    subject: 'Test email',
    text: 'This is a test email sent from Node.js using nodemailer.'
};

// list of 1000 recipients
let recipients = emailAddresses;
for (let i = 0; i < 100000; i++) {
  recipients.push(`${emailAddresses}` + i + '@example.com');
}

// send email to each recipient
recipients.forEach((recipient) => {
    mailOptions.to = recipient;
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent to ' + recipient + ': ' + info.response);
        }
    });
});
