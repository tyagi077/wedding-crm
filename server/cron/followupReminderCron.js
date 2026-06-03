const Followup = require('../models/Followup')
const Notification = require('../models/Notification')

const runReminderSweep = async (io) => {

  try {

    const now = new Date()

    const dueFollowups = await Followup.find({
      completed: false,
      reminderSent: false,
      followupDate: {
        $lte: now,
      },
    }).populate('leadId')

    for (const followup of dueFollowups) {

      const message = `Follow-up due now for ${followup.leadId?.name || 'a lead'}`

      const notification = await Notification.create({
        message,
        leadId: followup.leadId?._id || followup.leadId,
      })

      followup.reminderSent = true
      await followup.save()

      io.emit('newNotification', notification)

    }

  } catch (error) {

    console.log('Followup reminder cron error:', error.message)

  }

}

const startFollowupReminderCron = (io) => {

  runReminderSweep(io)

  const intervalId = setInterval(() => {
    runReminderSweep(io)
  }, 60000)

  return () => clearInterval(intervalId)

}

module.exports = startFollowupReminderCron