#!/bin/env node


var  WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
        port: 8000}
);

wss.on('connection', function (socket) {

    socket.send('Hello');
		
    socket.on('message', function (data) {
        console.log(data);
    });

});


console.log('Running');
