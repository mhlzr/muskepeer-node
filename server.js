#!/bin/env node


/*var  WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
        port: process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT  || 8080;}
);

wss.on('connection', function (socket) {

    socket.send('Hello');
		
    socket.on('message', function (data) {
        console.log(data);
    });

});


console.log('Running');*/


var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080);
console.log('Server running at http://127.0.0.1:1337/');