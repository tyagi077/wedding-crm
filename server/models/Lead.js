const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({

  name: String,

  phone: String,

  city: String,

  status: {
    type: String,
    default: 'NEW',
  },

  notes: {
    type: String,
    default: '',
  },
  weddingDate: Date,

})

module.exports = mongoose.model(
  'Lead',
  leadSchema,
)