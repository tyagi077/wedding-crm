const Lead = require('../models/Lead')
const Activity = require('../models/Activity')
exports.getLeads = async (req, res) => {

  try {

    const leads = await Lead.find()

    res.json(leads)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

exports.getSingleLead = async (req, res) => {

  try {

    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found'
      })
    }

    res.json(lead)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

exports.createLead = async (req, res) => {

  try {

    const lead = await Lead.create(req.body)
    await Activity.create({

  leadId: lead._id,

  message: 'Lead Created',

})

    res.json(lead)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}
exports.updateLead = async (req, res) => {

  try {

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    await Activity.create({

  leadId: updatedLead._id,

  message: `Lead Updated → ${updatedLead.status}`,

})

    res.json(updatedLead)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

exports.getDashboardStats = async (req, res) => {

  try {

    const totalLeads = await Lead.countDocuments()

    const bookedLeads = await Lead.countDocuments({
      status: 'BOOKED',
    })

    const hotLeads = await Lead.countDocuments({
      status: 'INTERESTED',
    })

    const followups = await Lead.countDocuments({
      status: 'FOLLOW_UP',
    })

    res.json({

      totalLeads,

      bookedLeads,

      hotLeads,

      followups,

    })

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}