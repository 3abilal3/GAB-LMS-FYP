const mongoose = require('mongoose');

const LeadCategorySchema = new mongoose.Schema({
    category: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'non active'],
      required: true
    }
  });

  module.exports = mongoose.model('LeadCategory', LeadCategorySchema);