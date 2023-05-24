const mongoose = require('mongoose');

const LeadManagerSchema = new mongoose.Schema({
  leadManagerId: {
    type: String,
    required: true,
  },
  leadManagerName: {
    type: String,
  },
  leadInfo: [
    {
      companyName: {
        type: String,
      },
      leadTitle: {
        type: String,
      },
      leadSource: {
        type: String,
      },
      status: {
        type: String,
      },
      referralName: {
        type: String,
      },
      description: {
        type: String,
      },
      staffName: {
        type: String,
      },
      otherDetails: {
        type: String,
      },
      followUpDate: {
        type: Date,
      },
      followUpTime: {
        type: String,
      },
      assignedManager: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('LeadManager', LeadManagerSchema);