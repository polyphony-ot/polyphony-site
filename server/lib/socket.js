"use strict";

function Socket(wsSocket) {
    wsSocket.on("message", function(message) {
        this.onMessage(message);
    }.bind(this));
}

module.exports = Socket;
