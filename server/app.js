require('colors')

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server, {log:false})
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
    while (true) {
        var waitingClients = io.sockets.clients('waitingForGame')
        if (waitingClients.length < 2)
            break;
    
        console.log('Found 2 clients - '+('matchmaking!'.red));
        gameCounter++;
        waitingClients.slice(0, 2).forEach(function(wc, idx){
            wc.leave('waitingForGame');
            wc.join('game.'+gameCounter);
            console.log('Player '+(idx+1)+': '+(wc.handshake.address.address.cyan));
        });
        console.log('Fight!!'.yellow);
    }
}, 2000);
