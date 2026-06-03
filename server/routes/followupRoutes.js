    const express = require('express')

const router = express.Router()

const {
  createFollowup,
  getLeadFollowups,
  getTodayFollowups,
  getAllFollowups,
  updateFollowup,
} = require('../controllers/followupController')

router.post('/', createFollowup)

router.get('/lead/:leadId', getLeadFollowups)

router.put('/:id', updateFollowup)

router.get('/today', getTodayFollowups)

router.get('/', getAllFollowups)

module.exports = router