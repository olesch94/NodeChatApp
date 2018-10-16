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
    var formattedTime = moment(message.createdAt).format('hh:mmA');
    console.log("New mesaage in chat", message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${formattedTime}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('hh:mmA');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: ${formattedTime}`);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

//jQuery event listener for form submit
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function(){
        messageTextbox.val('');
    });
});



//jQuery event listener for send location button
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('sending');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
    });
});