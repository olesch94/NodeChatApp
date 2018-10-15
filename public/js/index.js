//This creates a web socket connection
var socket = io();          

socket.on('connect', function () {
  console.log('Connected to server');     //This can be seen in the console tab of developer tools in Chrome

    socket.emit('createMessage', {
        from:'Olesch',
        text:'hey guys, Olesch here!'
    });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//newMessage listener
socket.on('newMessage', (messageInfo)=>{
    console.log("New mesaage in chat", messageInfo);
});