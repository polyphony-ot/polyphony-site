"use strict";

var ws = require("ws");
var Socket = require("./socket");

function SocketServer() {
    this._wsServer = new ws.Server({
        port: 51015
    });

    this._wsServer.on("connection", function(wsSocket) {
        var socket = new Socket(wsSocket);
        this.onConnection(socket);
    }.bind(this));
}

SocketServer.prototype = {
    broadcast: function(message) {
        var clients = this._wsServer.clients;
        for (var i in clients) {
            clients[i].send(message);
        }
    },
    close: function() {
        this._wsServer.close();
    }
};

module.exports = SocketServer;
