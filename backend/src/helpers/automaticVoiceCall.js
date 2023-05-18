const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = require('twilio')(accountSid, authToken);

// list of 1000 recipients
// create an array of phone numbers using a loop
let recipients = [];
for (let i = 1; i <= 1000; i++) {
  recipients.push(`+1${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`);
}

// make a call to each recipient
recipients.forEach((recipient) => {
  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml', // replace with your TwiML URL
      from: '+1415xxxxxxx', // replace with your Twilio phone number
      to: recipient
    })
    .then((call) => console.log(`Call initiated to ${recipient}: ${call.sid}`))
    .catch((error) => console.error(`Error making call to ${recipient}: ${error.message}`));
});
