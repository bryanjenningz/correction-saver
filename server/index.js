const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('dist'))

io.on('connection', (socket) => {
  console.log('user connected')
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(8000, () => console.log('Listening on port 8000'))
