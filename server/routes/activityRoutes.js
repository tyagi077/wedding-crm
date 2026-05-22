const express = require('express')

const router = express.Router()

const {
  getLeadActivities,
} = require('../controllers/activityController')

router.get('/:leadId', getLeadActivities)

module.exports = router