"use strict";

function Socket(wsSocket) {
	this._wsSocket = wsSocket;

    wsSocket.on("message", function(message) {
        this.onMessage(message);
    }.bind(this));
}

Socket.prototype = {
	send: function(message) {
		this._wsSocket.send(message);
	}
};

module.exports = Socket;
