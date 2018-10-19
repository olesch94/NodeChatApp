const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

//Create a server using http library and give it to socket IO. This will let us accept any connections from the incoming client.
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

var paramObject = {};
//Register a particular event listener. Below we will use a built in event - connection

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) =>{
    console.log(params);
    paramObject = params;
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room are required');
    }
  
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Hi there, Welcome to the chatroom'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback();   //1st argument is empty, so we are not passing any errors back
  });

  //For sending an acknowledgement back to the client from the server which is listening, add a 2nd argument to the callback function
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      //Send to everyone in the room
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
      
    //io.to('renee').emit('newMessage', generateMessage(message.from, message.text));    --
    callback();
  });

  socket.on('createLocationMessage', (coords) =>{
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }    
  });

  socket.on('disconnect', ()=> {
    console.log('Client has disconnected');
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left the conversation`));
    }
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

//To emit to a specific room
//io.to('Heroes room').emit
//socket.broadcase.to('Heroes room').emit