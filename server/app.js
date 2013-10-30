require('colors')

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  ;

server.listen(8080);

app.use(express.static('../client'));

io.sockets.on('connection', function(sock) {
    console.log('New client connected. Waiting for game.');
    sock.join('waitingForGame');
});


var runningGames = [];

// matchmaker
var gameCounter = 0;
setInterval(function(){
    var waitingClients = io.sockets.clients('waitingForGame');
    while (waitingClients.length > 1) {
        console.log('Found 2 clients - '+('matchmaking!'.blue));
        gameCounter++;
        waitingClients.slice(0, 1).forEach(function(wc){
            wc.leave('waitingForGame');
            wc.join('game.'+gameCounter);
            console.log();
        });
    }
}, 2000);
