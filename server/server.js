const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

//Create a server using http library and give it to socket IO. This will let us accept any connections from the incoming client.
var server = http.createServer(app);
var io = socketIO(server);

//Register a particular event listener. Below we will use a built in event - connection

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('createMessage', (message) => {
    console.log('createmessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', ()=> {
    console.log('Client has disconnected');
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});










//Notes
//socket.on listens to an event. Could be built in or custom event
//socket.emit emits an event to a single connection
//io.emit emits an event to all the connections.
//http is a unidirectional protocol - Always the client sends a request to the server
//websockets allow bidirectional communication
//Emitting and listening to custom events is where socket.io gets interesting