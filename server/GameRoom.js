require('colors');

var _ = require('underscore')
  , GameBall = require('./GameBall')
  , Paddle = require('./Paddle')
  , ClientController = require('./ClientController')
  , async = require('async')
  ;

var gameCounter = 0;

var GameRoom = function(io){
    this.io = io;
    this.roomNumber = ++gameCounter;
    this.ioRoom = 'game.'+this.roomNumber;
    this.clients = [];
    
    this.ball = new GameBall();
    this.ball.onCollide = function(what){ // what: player = 1, wall = 2
        this.io.sockets.in(this.ioRoom).emit('c', what);
        this.updateBall(false);
    }.bind(this);
    this.ball.server = true;
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
    
    this.running  = true;
    this.log('Fight!!'.yellow);
    
    this.intervals = [
        // update the ball physics (more frequently the better)
        setInterval(this.ball.tick.bind(this.ball), 10),
        // relay accurate position information to the clients
        setInterval(this.updateBall.bind(this, true), 200)
    ];
    
    //setTimeout(this.updateBall.bind(this, {angle:1,speed:0.001}), 3000);
    setTimeout(this.updateBall.bind(this, false, {angle:1,speed:0.005,x:0.5}), 1000);
};
GameRoom.prototype.updateBall = function(volatile, data) {
    this.ball.update(data || {});
    var roomSocks = this.io.sockets.in(this.ioRoom);
    if (volatile) { roomSocks = roomSocks.volatile; }
    roomSocks.emit('b', _.pick(
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
    this.running = false;
    this.intervals.forEach(clearInterval);
};

module.exports = GameRoom;