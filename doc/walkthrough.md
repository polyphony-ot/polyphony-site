Walkthrough
===========

This guide explains how the Polyphony site works and how to use polyphony-js.

Client Side
-----------

The client portion of the site is extremely simple. It has a single page -
`index.html` which references some JavaScript in order to create the editor and
connect to the server. Let's focus on `scripts/polyphony-demo.js` since that's
where everything interesting happens.

First, we create the editor. The editor is created using
[quill.js](http://quilljs.com) by giving quill.js the ID of a div.

```js
var editor = new Quill("#editor");
```

The next step is to create our polyphony-js client. We initialize the client
with the URL to our server, which we arbitrarily chose to be a WebSocket
listening on the same host on port 51015.

```js
var client = new polyphony.Client("ws://" + window.location.hostname + ":51015");
```

Now that we have an editor and a Polyphony client, we can tie the two together.
Polyphony provides a `QuillAdapter` that lets you easily connect a quill editor
to a polyphony client.

```js
var adapter = new polyphony.QuillAdapter(editor, client);
```

That's it! We now have a functioning real-time editor in the browser.

See the [Advanced](#advanced) section below for details on how to create your
own adapter if you want to use an editor other than Quill.

Server Side
-----------

The server portion uses `ws` (a WebSocket library) to implement the
`SocketServer` and `Socket` interfaces that are needed by Polyphony.

The `Socket` object represents a WebSocket connection to a specific client. It
implements the `onMessage()` and `send()` functions. `onMessage` is called
whenever a message is received from a client. `send` is called by polyphony
whenever a message should be sent to a client.

```js
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
```

The `SocketServer` object represents a WebSocket server that listens for
connections from new clients. The `onConnection` function is called with a
`Socket` whenever a new client connects. The `broadcast` function sends a
message to all connected clients.

```js
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
```

Once we have these two objects, all that's left to do is create a new polyphony
server.

```js
var socketServer = new SocketServer();
var server = new polyphony.Server(socketServer);
```

With our server and client complete, we now have fully functioning site with
real-time text editing!

Wrapping it Up
--------------

Hopefully this guide helps show how to use polyphony-js. With just a little bit
of glue code, we're able to create a site with real-time text editing. Be sure
to also look at the documentation for polyphony-js for more information.

Advanced
--------

### How to Create Your Own Adapter

The Quill adapter used by the site makes it easy to connect to a quill.js
editor, but it doesn't mean that you're limited to using Quill. Let's look at
how you'd make your own adapter for a regular `<textarea>`.

The purpose of an adapter is to glue a polyphony client to an editor by
translating events between the two. When the editor fires an event, the adapter
creates a new operation representing the user's changes. When the client fires
an event, it updates the editor with the changes in the given operation.

#### Editor to Polyphony

The first step in making our adapter is to provide a handler for the textarea's
`oninput` event. Whenever the textarea's content changes, we need to figure out
what changed, and then convert those changes into a Polyphony operation.

```js
var editor = document.getElementById("#editor");
editor.oninput = function() {
    // Create a new operation that will represent any changes the user made.
    var op = new polyphony.Op();

    // Somehow diff the contents of the editor to figure out what changed.
    // jsdiff is a good choice - https://github.com/kpdecker/jsdiff
    var diffs = diffChanges();

    // Convert your diff to an operation using the skip, insert, and delete
    // methods on your op.
    for (var i = 0; i < diff.length; i++) {
        // If text was unchanged, mark it as skipped with:
        // op.skip(count);

        // If text was added, also add it to the operation with:
        // op.insert(text);

        // If text was deleted, also delete it from the operation with:
        // op.delete(length);
    };

    // After we've built our operation, we can give it to the client.
    client.apply(op);
};
```

#### Polyphony to Editor

Now to go in the other direction - when the client fires an event we need to
update the textarea. Operations have an `apply` method that make it easy to
apply the operation to an editor. It takes three callbacks: `skipFunc`,
`insertFunc`, and `deleteFunc`.

```js
client.onEvent = function(type, op) {
    op.apply(
        function skipFunc(index, count) {
            // Skip "count" characters starting at "index".
        },
        function insertFunc(index, text) {
            // Insert the string "text" starting at "index" into the textarea.
        },
        function deleteFunc(index, count) {
            // Delete "count" characters starting at "index" from the textarea.
        },
    );
}
```

With these two event handlers, we have a perfectly functioning adapter. There
are some additional concepts that we glossed over (like maintaining the cursor's
position when the text changes) but what we have is adequate for a simple
plain-text editor.
