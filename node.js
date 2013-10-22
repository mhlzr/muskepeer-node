/**
 *
 * @author Matthieu Holzer
 * @version 0.1
 */

var argv = require('optimist')
        .usage('Usage: $0 --server=[url]')
        .demand(['server'])
        .argv,
    clients = [],
    socket,
    io = require('socket.io').listen(8080),
    uuid = require('node-uuid');

//Global Exception Handling
process.on('uncaughtException', function (err) {
    console.error(err.stack);
});


//connect to server passed via argv
// we do this via UDP
//console.log('Connecting to: ', argv.server);
//socket = require('socket.io-client').connect(argv.server);


io.sockets.on('connection', function (socket) {

    clients.push({
        id     : uuid.v4(),
        socket : socket
    });

    socket.on('auth', function (data) {
        console.log(data);
    });

    socket.on('candidate', function (data) {
        console.log('candidate');
        app.io.sockets.emit('candidate', data);
    });

    socket.on('offer', function (data) {
        console.log('offer');
        app.io.sockets.emit('offer', data);
    });


    socket.on('answer', function (data) {
        console.log('answer');
        app.io.sockets.emit('answer', data);
    });


});