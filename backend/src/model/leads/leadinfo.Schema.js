const mongoose = require('mongoose');

const LeadInfoSchema = new mongoose.Schema({
  leadInfoId:{
    type: Number,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  leadTitle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  leadSource: {
    type: String,
    enum: ['fb', 'insta', 'google ads', 'website', 'emp referral', 'client referral', 'office phone'],
    required: true
  },
  referralName: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  otherDetails: {
    type: String
  },
  followUpDate: {
    type: Date,
    default: Date.now(),
    required: true
  },
  followUpTime: {
    type: String,
    default: () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      return time;
    },
    required: true
  },
  
  attachment: {
    type: String
  } ,
  // assignedTo: {
  //   type: String
  // },
  // assignedBy: {
    
  // },

  //Addition during testing

});


module.exports = mongoose.model('LeadInfo', LeadInfoSchema);
