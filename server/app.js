var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  ;

server.listen(8080);

app.use(express.static('../client'));

io.sockets.on('connection', function(sock) {
    sock.join('waitingForGame');
});


var runningGames = [];

// matchmaker
var gameCounter = 0;
setInterval(function(){
    var waitingClients = io.sockets.clients('waitingForGame');
    while (waitingClients.length > 1) {
        gameCounter++;
        waitingClients.slice(0, 1).forEach(function(wc){
            wc.leave('waitingForGame');
            wc.join('game.'+gameCounter);
        });
    }
}, 2000);
