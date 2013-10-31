require('colors');
var _ = require('underscore');

var gameCounter = 0;

var GameRoom = function(io){
    this.io = io;
    this.roomNumber = ++gameCounter;
    this.ioRoom = 'game.'+this.roomNumber;
    this.clients = [];
    this.ball = {x:0.5,y:0.5,angle:0,speed:0};
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
    
    sock.on('m', function(pos){
        sock.broadcast.to(this.ioRoom).volatile.emit('m', {side:client.side, pos:pos});
    });
    
    this.clients.push(client);
    
    this.log('Player '+client.side+' joined: '+(sock.handshake.address.address.cyan));
    
    if (this.clients.length == 2)
        this.gameStart();
};
GameRoom.prototype.gameStart = function(){
    this.clients.forEach(function(client){
        client.sock.emit('startGame', {
            roomNumber: this.roomNumber,
            competitors: this.clients.map(function(cli){
                return {
                    ip: cli.sock.handshake.address.address,
                    score: cli.score,
                    side: cli.side
                };
            }),
            yourSide: client.side
        });
    }.bind(this));
    this.log('Fight!!'.yellow);
    
    this.broadcastBallUpdate.call(this, 0.5, 0.5, 0, 0);
    setTimeout(this.broadcastBallUpdate.bind(this, {angle:1,speed:0.01}), 2000);
};
GameRoom.prototype.updateBall = function() {
    _.extend(this.ball, ballUpdate || {});
    this.io.sockets.in(this.ioRoom).emit('b', this.ball);
};
GameRoom.prototype.log = function(){
    console.log.bind(console, 'Game Room '+this.roomNumber+':').apply(console, arguments);
};

module.exports = GameRoom;