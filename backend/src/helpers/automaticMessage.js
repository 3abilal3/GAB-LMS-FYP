const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = require('twilio')(accountSid, authToken);

// list of 100000 recipients
let recipients = [];
for (let i = 1; i <= 100000; i++) {
  recipients.push(`+1${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`);
} 
  
// send SMS message to each recipient
recipients.forEach((recipient) => {
  client.messages
    .create({
      body: 'This is a test SMS message sent from Node.js using Twilio.',
      from: '+1415xxxxxxx', // replace with your Twilio phone number
      to: recipient
    })
    .then((message) => console.log(`SMS message sent to ${recipient}: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS message to ${recipient}: ${error.message}`));
});
