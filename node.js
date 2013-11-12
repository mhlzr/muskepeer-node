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
    peers = require('./lib/collections/peers'),
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
        peers.remove(peers.getPeerBySocket(socket));
    });

});

/*
 wss.broadcast = function(data) {
 for(var i in this.peers)
 this.peers[i].send(data);
 };
 */
function messageHandler(socket, data) {
    var peer;

    if (!data.cmd) return;

    switch (data.cmd.toLowerCase()) {
        case 'peer:auth' :

            //Todo Test if peers authToken matches
            var success = peers.add({
                location: {lat: 0, long: 0},
                socket: socket,
                uuid: data.uuid
            });

            sendToPeer(socket, {cmd: 'peer:auth', data: {success: success}});

            //https://github.com/einaros/ws/blob/master/lib/ErrorCodes.js
            if (!success) socket.close(1008, 'Missing auth-credentials or already registered.');

            break;
        case 'peer:list' :
            sendToPeer(socket, {cmd: 'peer:list', data: peers.list()});
            break;
        case 'peer:offer' :
            peer = peers.getPeerByUuid(data.targetPeerUuid);
            //swap data.targetUuid <-> data.uuid
            sendToPeer(peer.socket, {cmd: 'peer:offer', data: {targetPeerUuid: data.uuid, offer: data.offer}});
            break;
        case 'peer:answer' :
            peer = peers.getPeerByUuid(data.targetPeerUuid);
            //swap data.targetUuid <-> data.uuid
            sendToPeer(peer.socket, {cmd: 'peer:answer', data: {targetPeerUuid: data.uuid, answer: data.answer}});
            break;
    }
}


function sendToPeer(socket, data) {
    //state 1 = ready
    if (socket.readyState !== 1) return;
    socket.send(JSON.stringify(data));
}