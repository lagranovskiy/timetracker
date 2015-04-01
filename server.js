'use strict';
/**
 * Static HTTP Server
 *
 * Create a static file server instance to serve files
 * and folder in the './public' folder
 */



var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8000));
app.use(express.static(__dirname + '/app'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

console.log(app.get('port'));

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});