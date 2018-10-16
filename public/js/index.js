//This creates a web socket connection
var socket = io();          

socket.on('connect', function () {
  console.log('Connected to server');     //This can be seen in the console tab of developer tools in Chrome
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//newMessage listener
socket.on('newMessage', function(message){
    console.log("New mesaage in chat", message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

//jQuery event listener for form submit
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){

    });
});