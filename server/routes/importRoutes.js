const express = require('express')

const multer = require('multer')

const router = express.Router()

const {
  importLeads,
} = require('../controllers/importController')

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, 'uploads/')

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + '-' + file.originalname
    )

  },

})

const upload = multer({ storage })

router.get('/data', (req, res) => {
  res.send('Import route is working')
})

router.post(
  '/data',
  upload.single('file'),
  importLeads
)


module.exports = router