//This creates a web socket connection
var socket = io();          

socket.on('connect', function () {
  console.log('Connected to server');     //This can be seen in the console tab of developer tools in Chrome
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//To show the latest message to the user
function scrollToBottom(){
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights 
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
};

//newMessage listener
socket.on('newMessage', function(message){
    var formattedTime = moment(message.createdAt).format('hh:mmA');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('hh:mmA');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

//jQuery event listener for form submit
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();         //Prevent form reload
    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function(){
        //Clear the textbox once we receive the acknowledgement from the server
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