const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({

  name: String,

  phone: String,

  city: String,

  email: {
    type: String,
    default: '',
  },

  eventType: {
    type: String,
    default: '',
  },

  budget: {
    type: String,
    default: '',
  },

  status: {
    type: String,
    default: 'NEW',
  },

  weddingDate: Date,

  followUpDate: Date,

  notes: {
    type: String,
    default: '',
  },

})

module.exports = mongoose.model(
  'Lead',
  leadSchema,
)