require('colors')

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server, {log:false})
  , GameRoom = require('./GameRoom')
  ;

server.listen(8080);

app.use(express.static('../client'));
app.get('/js/GameBall.js', function(req, res){ res.sendfile('GameBall.js'); });
app.get('/js/Paddle.js', function(req, res){ res.sendfile('Paddle.js'); });
app.get('/js/lib/SAT.js', function(req, res){ res.sendfile('SAT.js'); });
app.get('/js/lib/underscore-min.js', function(req, res){ res.sendfile('node_modules/underscore/underscore-min.js'); });

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
