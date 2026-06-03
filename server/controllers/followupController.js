const Followup = require('../models/Followup')
const Notification = require('../models/Notification')
const Activity = require('../models/Activity')
exports.createFollowup = async (req, res) => {

  try {

    const followup = await Followup.create({
      ...req.body,
      completed: false,
    })

    await Activity.create({

      leadId: req.body.leadId,

      message: 'Followup Scheduled',

    })

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

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const followups = await Followup.find({
      completed: false,
      followupDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate('leadId')

    res.json(followups)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

exports.getLeadFollowups = async (req, res) => {

  try {

    const followups = await Followup.find({
      leadId: req.params.leadId,
    })
      .populate('leadId')
      .sort({ followupDate: -1, createdAt: -1 })

    res.json(followups)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

exports.updateFollowup = async (req, res) => {

  try {

    const update = { ...req.body }

    if (typeof update.completed === 'boolean') {
      update.completedAt = update.completed ? new Date() : null
    }

    const followup = await Followup.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate('leadId')

    if (!followup) {
      return res.status(404).json({
        message: 'Followup not found',
      })
    }

    await Activity.create({
      leadId: followup.leadId?._id || followup.leadId,
      message: followup.completed
        ? 'Followup Completed'
        : 'Followup Reopened',
    })

    res.json(followup)

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
      .sort({ followupDate: 1, createdAt: -1 })

    res.json(followups)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}