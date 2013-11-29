#!/bin/env node


var  WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
        port: process.env.OPENSHIFT_NODEJS_PORT || 8080}
);

wss.on('connection', function (socket) {

    socket.send('Hello');
		
    socket.on('message', function (data) {
        console.log(data);
    });

});


console.log('Running');
