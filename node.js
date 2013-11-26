/**
 *
 * @author Matthieu Holzer
 * @version 0.1
 */

var _ = require('underscore'),
    util = require('util'),
    peers = require('./lib/collections/peers'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
            port: process.env.WEBSOCKET_PORT || 8080}
    );

//Global Exception Handling
process.on('uncaughtException', function (err) {
    console.error(err.stack);
});


//TODO connect to other notes via udp and create a replica network

wss.on('connection', function (socket) {

    socket.on('message', function (data) {
        console.log('received: %s', data);
        messageHandler(socket, JSON.parse(data));
    });

    socket.on('close', function (e) {
        peers.remove(peers.getPeerBySocket(socket));
    });

});

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
        case 'peer:candidate' :
            peer = peers.getPeerByUuid(data.targetPeerUuid);
            sendToPeer(peer.socket, {cmd: 'peer:candidate', data: {targetPeerUuid: data.uuid, candidate: data.candidate}});
    }
}


function sendToPeer(socket, data) {
    //state 1 = ready
    if (socket.readyState !== 1) return;
    socket.send(JSON.stringify(data));
}