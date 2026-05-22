const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({

  message: String,

  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },

  read: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
})

module.exports = mongoose.model(
  'Notification',
  notificationSchema
)