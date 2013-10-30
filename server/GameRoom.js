require('colors');

var gameCounter = 0;

var GameRoom = function(io){
    this.io = io;
    this.roomNumber = ++gameCounter;
    this.ioRoom = 'game.'+this.roomNumber;
    this.clients = [];
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
    
    sock.on('m', function(data){
        data.what = 'Player '+client.side+'\'s paddle moved, just letting you know.';
        sock.broadcast.to(this.ioRoom).volatile.emit('m', data);
    });
    
    this.clients.push(client);
    
    this.log('Player '+client.side+' joined: '+(sock.handshake.address.address.cyan));
    
    if (this.clients.length == 2)
        this.gameStart();
};
GameRoom.prototype.gameStart = function(){
    this.io.sockets.in(this.ioRoom).emit('startGame', {
        'roomNumber': this.roomNumber,
        'competitors': this.io.sockets.clients(this.ioRoom).map(function(i){return i.handshake.address.address})
    });
    this.log('Fight!!'.yellow);
};
GameRoom.prototype.log = function(){
    console.log.bind(console, 'Game Room '+this.roomNumber+':').apply(console, arguments);
};

module.exports = GameRoom;