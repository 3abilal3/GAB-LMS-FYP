const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  CompanyName: {
    type: String,
    required: true
  },
  Telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  contactPersonName: {
    type: String,
    required: true
  },
  contactPersonMobileNumber: {
    type: String,
    required: true
  },
  contactPersonEmail: {
    type: String,
    required: true
  },
  otherDetails: {
    type: String
  },
  country: {
    type: String
  },
  State: {
    type: String
  },
  city: {
    type: String
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
