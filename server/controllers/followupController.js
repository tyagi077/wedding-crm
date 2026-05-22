const Followup = require('../models/Followup')
const Notification = require('../models/Notification')
const Activity = require('../models/Activity')
exports.createFollowup = async (req, res) => {

  try {

    const followup = await Followup.create(req.body)

    const notification = await Notification.create({

  message: 'New Followup Scheduled 📞',

  leadId: req.body.leadId,

})

    req.app.get('io').emit('newNotification',notification)

    res.json(followup)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

exports.getTodayFollowups = async (req, res) => {

  try {

    const followups = await Followup.find({
      completed: false,
    }).populate('leadId')
    await Activity.create({

  leadId: req.body.leadId,

  message: 'Followup Scheduled',

})

    res.json(followups)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}
exports.getAllFollowups = async (req, res) => {

  try {

    const followups = await Followup.find()
      .populate('leadId')

    res.json(followups)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}