const express = require('express')

const router = express.Router()

const {
  getLeads,
  getSingleLead,
  createLead,
  updateLead,
  getDashboardStats,
} = require('../controllers/leadController')

router.get('/', getLeads)

router.get('/:id', getSingleLead)

router.post('/', createLead)

router.get('/stats/dashboard', getDashboardStats)

router.put('/:id', updateLead)

module.exports = router