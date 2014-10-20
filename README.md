Polyphony Site
==============

This project contains the code for running the Polyphony site at
<http://polyphony-ot.com>. It also serves as an example of how to use the
polyphony-js library.

Running
-------

Make sure you have node and some sort of HTTP server installed. Something like
[http-server](https://www.npmjs.org/package/http-server) is a solid choice.

First, setup and start the node OT server:

    $ cd polyphony-site/server
    $ npm install
    $ node main.js

Next, start up the HTTP server:

    $ http-server polyphony-site

Then just visit localhost:8080 (or whatever address you told your HTTP server to
listen on) in your browser and try it out!
