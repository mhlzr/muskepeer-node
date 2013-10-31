var _ = require('underscore'),
    _clients = [];

module.exports = {

    list: function () {
        //no need to transfer the socket object
        return _.map(_clients, function (client) {
            delete client.socket;
            return client;
        });
    },

    add: function (client) {

        //missing values?
        if (!client.socket || !client.uuid || !client.location) return false;

        //already existent?
        if (this.getClientByUuid(client.uuid)) return false;

        _clients.push(client);

        //TODO sort array?

        return true;
    },

    remove: function (client) {
        if (!client) return false;

        _clients = _.without(_clients, client);

        return true;
    },

    getClientByUuid: function (uuid) {
        return _.findWhere(_clients, {uuid: uuid});
    },

    getClientBySocket: function (socket) {
        return _.findWhere(_clients, {socket: socket});
    }

};