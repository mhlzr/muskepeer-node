/**
 *
 * @author Matthieu Holzer
 * @version 0.1
 */

var _ = require('underscore'),
    util = require('util'),
    argv = require('optimist')
        .usage('Usage: $0 --server=[url]')
        .demand(['server'])
        .argv,
    clients = require('./lib/collections/clients'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080});

//Global Exception Handling
process.on('uncaughtException', function (err) {
    console.error(err.stack);
});


//TODO connect to other notes via udp and create a replica network
//connect to server passed via argv
// we do this via UDP
//console.log('Connecting to: ', argv.server);
//socket = require('socket.io-client').connect(argv.server);


wss.on('connection', function (socket) {

    socket.on('message', function (data) {
        console.log('received: %s', data);
        messageHandler(socket, JSON.parse(data));
    });

    socket.on('close', function (e) {
        clients.remove(clients.getClientBySocket(socket));
    });

});

/*
 wss.broadcast = function(data) {
 for(var i in this.clients)
 this.clients[i].send(data);
 };
 */
function messageHandler(socket, data) {

    if (!data.cmd) return;

    switch (data.cmd.toLowerCase()) {
        case 'peer:auth' :

            //Todo Test if clients authToken matches
            var success = clients.add({
                location: {lat: 0, long: 0},
                socket: socket,
                uuid: data.uuid
            });

            sendToPeer(socket, {cmd: 'peer:auth', data: {success: success}});

            //https://github.com/einaros/ws/blob/master/lib/ErrorCodes.js
            if (!success) socket.close(1008, 'Missing auth-credentials or already registered.');

            break;
        case 'peer:list' :
            sendToPeer(socket, {cmd: 'peer:list', data: clients.list()});
            break;
        case 'webrtc:answer' :
            break;
        case 'webrtc:candidate'  :
            break;
        case 'webrtc:offer' :
            break;
    }
}


function sendToPeer(socket, data) {
    //state 1 = ready
    if (socket.readyState !== 1) return;
    socket.send(JSON.stringify(data));
}