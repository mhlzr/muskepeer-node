#!/bin/env node
//  OpenShift sample Node application

var  WebSocketServer = require('ws').Server;

var wss = new WebSocketServer(
		{
		host:process.env.OPENSHIFT_NODEJS_IP,
        port: process.env.OPENSHIFT_NODEJS_PORT  || 8080
		}
);

wss.on('connection', function (socket) {

    socket.send('Hello');
		
    socket.on('message', function (data) {
        console.log(data);
    });

});

/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(process.env.OPENSHIFT_NODEJS_PORT);
  res.write(process.env.OPENSHIFT_NODEJS_IP);
  res.end('Test\n');
}).listen(process.env.OPENSHIFT_NODEJS_PORT  || 8080, process.env.OPENSHIFT_NODEJS_IP);
/*

