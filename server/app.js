require('colors')

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server, {log:false})
  , GameRoom = require('./GameRoom')
  ;

server.listen(8080);

app.use(express.static('../client'));

io.sockets.on('connection', function(sock) {
    console.log('New client connected. Waiting for game.');
    sock.join('waitingForGame');
});

// matchmaker
setInterval(function(){
    while (true) {
        var waitingClients = io.sockets.clients('waitingForGame')
        if (waitingClients.length < 2)
            break;

        var gameRoom = new GameRoom(io);
        
        waitingClients.slice(0, 2).forEach(function(wc){
            wc.leave('waitingForGame');
            gameRoom.join(wc);
        });
    }
}, 2000);
