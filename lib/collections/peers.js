var _ = require('underscore'),
    _peers = [];

module.exports = {

    list: function () {
        //no need to transfer the socket object
        return _.map(_peers, function (peer) {
            return {uuid: peer.uuid, location: peer.location};
        });
    },

    add: function (peer) {

        //missing values?
        if (!peer.socket || !peer.uuid || !peer.location) return null;

        //already existent?
        if (this.getPeerByUuid(peer.uuid)) return null;

        _peers.push(peer);

        //TODO sort array?

        return peer;
    },

    remove: function (peer) {
        if (!peer) return false;
        _peers = _.without(_peers, peer);
        return true;
    },

    getPeerByUuid: function (uuid) {
        return _.findWhere(_peers, {uuid: uuid});
    },

    getPeerBySocket: function (socket) {
        return _.findWhere(_peers, {socket: socket});
    }

};