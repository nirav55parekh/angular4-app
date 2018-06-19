// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ ATS Pod  server                                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2016 ATS     
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Version to handle multiple devices                              │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

/*
 * Configurations and helpers
 */
var fs = require('fs'); 
var options1 = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')};
var app = require('express')();
//var http = require('https').Server(app);
// var http = require('https').createServer(options1,app);
var http = require('http').createServer(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

var tls= require('tls');
var namespace = '/pod';
var refreshTimer = 100; 
var connectionscounter = 0;
var serverport = 4200;
var time1 = Date.now();
var count = 0;
var eqsend={};
var eqbuff= [];
var reconnect=true;
var refresh1=300;
var socket1={};
var type1='unknown';
//var io = require('socket.io')(serverport);
var eqroom=[];
http.listen(serverport, function(){
  console.log('listening on *:4200');
});
