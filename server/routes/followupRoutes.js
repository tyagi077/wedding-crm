    const express = require('express')

const router = express.Router()

const {
  createFollowup,
  getTodayFollowups,
  getAllFollowups,
} = require('../controllers/followupController')

router.post('/', createFollowup)

router.get('/today', getTodayFollowups)

router.get('/', getAllFollowups)

module.exports = router