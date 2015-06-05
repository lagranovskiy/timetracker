'use strict';
/**
 * Static HTTP Server
 *
 * Create a static file server instance to serve files
 * and folder in the './public' folder
 */


require('newrelic');
var express = require('express');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 8000));
app.set('env', (process.env.NODE_ENV || 'dev'));
app.set('ttserver', (process.env.TT_SERVER_URL || 'https://localhost:4433'));
app.use(express.static(__dirname + '/app'));


// Rewrite config file with data about server component
var configData = 'var TimetrackerConfiguration = {  server: \'' + app.get('ttserver') + '\', env : \'' + app.get('env') + '\' };';
fs.writeFileSync('app/config.js', configData, 'utf-8');


app.get('/', function(request, response) {
  response.send('Hello World!');
});

console.log(app.get('port'));

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});