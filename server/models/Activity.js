const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({

  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },

  message: String,

}, {
  timestamps: true,
})

module.exports = mongoose.model(
  'Activity',
  activitySchema
)