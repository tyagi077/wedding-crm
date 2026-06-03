const mongoose = require('mongoose')

const followupSchema = new mongoose.Schema({

  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },

  followupDate: Date,

  note: String,

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: Date,

  reminderSent: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
})

module.exports = mongoose.model(
  'Followup',
  followupSchema
)