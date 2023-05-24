const mongoose = require('mongoose');

const StaffSchema = mongoose.Schema({
  staffId: {
    type: String,
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Staff', StaffSchema);
