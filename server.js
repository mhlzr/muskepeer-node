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
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  res.write('List:');
  for(var key in process.env){
	res.write(process.env[key]);
  }
  
  res.end();
  
}).listen(8080);