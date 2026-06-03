const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const http = require('http')

const { Server } = require('socket.io')

dotenv.config()


const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
app.set('io', io)

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
// SOCKET

io.on('connection', (socket) => {

  console.log('User Connected')

  socket.on('disconnect', () => {

    console.log('User Disconnected')

  })

})

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

server.listen(PORT, () => {

  console.log(`Server running on ${PORT}`)

})

