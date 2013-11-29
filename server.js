#!/bin/env node
//  OpenShift sample Node application

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Test\n');
}).listen(process.env.OPENSHIFT_NODEJS_PORT  || 8080, process.env.OPENSHIFT_NODEJS_IP);

