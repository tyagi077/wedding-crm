const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()


const app = express()

app.use(cors())

app.use(express.json())

// ROUTES

const leadRoutes = require('./routes/leadRoutes')

const followupRoutes = require('./routes/followupRoutes')
const notificationRoutes =require('./routes/notificationRoutes')
const importRoutes =
  require('./routes/importRoutes')
  const activityRoutes =
  require('./routes/activityRoutes')
app.use('/api/leads', leadRoutes)

app.use('/api/followups', followupRoutes)
app.use('/api/notifications',notificationRoutes)
app.use('/api/import', importRoutes)
app.use('/api/activities', activityRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log('MongoDB Connected')

})
.catch((err) => {

  console.log(err)

})

app.get('/', (req, res) => {

  res.send('API Running')

})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {

  console.log(`Server running on ${PORT}`)

})

