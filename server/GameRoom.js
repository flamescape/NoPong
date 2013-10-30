require('colors');

var GameRoom = function(io){
    this.io = io;
    this.roomNumber = ++this.gameCounter;
    this.ioRoom = 'game.'+this.roomNumber;
    this.clients = [];
    this.log('Room Created'.red);
};
GameRoom.prototype.join = function(client){
    if (this.clients.length >= 2)
        throw new Error('Too many clients in this room'); // until we add spectators AmIRite?
        
    this.clients.push(client);
    client.join(this.ioRoom);
    client.set('side', this.clients.length); // 1 == left, 2 == right; anything else == wtf
    this.log('Player '+(this.clients.length)+' joined: '+(client.handshake.address.address.cyan));
    
    if (this.clients.length == 2)
        this.gameStart();
};
GameRoom.prototype.gameStart = function(){
    this.io.sockets.in(this.ioRoom).emit('startGame', {
        'roomNumber': this.gameCounter,
        'competitors': this.io.sockets.clients(this.ioRoom).map(function(i){return i.handshake.address.address})
    });
    this.log('Fight!!'.yellow);
};
GameRoom.prototype.log = function(){
    console.log.bind(console, 'Game Room '+this.roomNumber+':').apply(console, arguments);
};
GameRoom.prototype.gameCounter = 0;

module.exports = GameRoom;