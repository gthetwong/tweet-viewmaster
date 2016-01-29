
var socket = io();
socket.on('tweet', function(data){
	console.log(data);
});

