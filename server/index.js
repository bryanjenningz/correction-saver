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

  socket.on('sendMessage', (message) => {
    console.log(`Message sent: ${message.text}`)
    io.emit('receiveMessage', message)
  })
})

server.listen(8000, () => console.log('Listening on port 8000'))
