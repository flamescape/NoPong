require('colors');

var ClientController = function(cli, room){
    this.lastPos = 0.5;
    
    cli.sock.on('m', function(pos){
        this.lastPos = pos;
        cli.sock.broadcast.to(room).volatile.emit('m', {side:cli.side, pos:pos});
    }.bind(this));
};

var _ = require('underscore')
  , GameBall = require('./GameBall')
  , Paddle = require('./Paddle')
  ;

var gameCounter = 0;

var GameRoom = function(io){
    this.io = io;
    this.roomNumber = ++gameCounter;
    this.ioRoom = 'game.'+this.roomNumber;
    this.clients = [];
    
    this.ball = new GameBall();
    this.paddles = [];
    
    this.log('Room Created'.red);
};
GameRoom.prototype.join = function(sock){
    if (this.clients.length >= 2)
        throw new Error('Too many clients in this room'); // until we add spectators AmIRite?
    
    sock.join(this.ioRoom);
    var client = {
        sock: sock,
        side: this.clients.length + 1, // 1 == left, 2 == right; anything else == wtf
        score: 0
    };
    
    this.clients.push(client);
    
    this.log('Player '+client.side+' joined: '+(sock.handshake.address.address.cyan));
    
    if (this.clients.length == 2)
        this.gameStart();
};
GameRoom.prototype.gameStart = function(){
    var startPositions = {
        1: 0.05,
        2: 0.95
    };
    
    var competitors = this.clients.map(function(cli){
        var competitorInfo = {
            ip: cli.sock.handshake.address.address,
            score: cli.score,
            side: cli.side,
            x: startPositions[cli.side]
        };
        
        var paddle = new Paddle(competitorInfo, new ClientController(cli, this.ioRoom));
        this.ball.addCollidingPaddle(paddle);
        this.paddles.push(paddle);
        cli.paddle = paddle;
        
        return competitorInfo;
    }.bind(this));
    
    this.clients.forEach(function(client){
        client.sock.emit('enterRoom', {
            roomNumber: this.roomNumber,
            competitors: competitors,
            yourSide: client.side
        });
    }.bind(this));
    
    this.log('Fight!!'.yellow);
    
    this.intervals = [
        // update the ball physics 60fps
        setInterval(this.ball.tick.bind(this.ball), 1000/60),
        // relay accurate position information to the clients every 1/2 second
        setInterval(this.updateBall.bind(this), 500)
    ];
    
    //setTimeout(this.updateBall.bind(this, {angle:1,speed:0.001}), 3000);
    setTimeout(this.updateBall.bind(this, {angle:1,speed:0,x:0.95}), 1000);
};
GameRoom.prototype.updateBall = function(data) {
    this.ball.update(data);
    this.io.sockets.in(this.ioRoom).emit('b', _.pick(
        this.ball,
        'x',
        'y',
        'angle',
        'speed'
    ));
};
GameRoom.prototype.log = function(){
    console.log.bind(console, 'Game Room '+this.roomNumber+':').apply(console, arguments);
};
GameRoom.prototype.terminate = function() {
    this.intervals.forEach(clearInterval);
};

module.exports = GameRoom;