'use strict';
/**
 * Static HTTP Server
 *
 * Create a static file server instance to serve files
 * and folder in the './public' folder
 */

// modules
var stat = require('node-static');
var http = require('http');
var serverPort, serverHost;

if (process.env.ENV && process.env.ENV === 'heroku') {
  if (process.env.PORT) {
    serverPort = process.env.PORT * 1;
  }

  serverHost = '0.0.0.0';
} else {
  serverPort = '8000';
  serverHost = 'localhost';
}



// config
var file = new stat.Server('./app', {
  cache: 3600,
  gzip: true
});

// serve
http.createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  }).resume();
}).listen(parseInt(serverPort), serverHost);

console.info('Listening to: http://' + serverHost + ':' + serverPort);