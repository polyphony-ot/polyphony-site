"use strict";

var SocketServer = require("./lib/socket-server");
var polyphony = require("polyphony");

var socketServer = new SocketServer();

var server = new polyphony.Server(socketServer);
process.on("exit", function() {
    server.close();
});
