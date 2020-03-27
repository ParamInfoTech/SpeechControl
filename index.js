var app = require('express')();
var http = require('http');
var socketIO = require('socket.io')
let server = http.createServer(app);
let io = socketIO(server);

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    console.log('A user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

server.listen(3000, function() {
    console.log('listening on *:3000');
});