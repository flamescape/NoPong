var ClientController = function(cli, room){
    this.lastPos = 0.5;
    
    cli.sock.on('m', function(pos){
        this.lastPos = pos;
        cli.sock.broadcast.to(room).volatile.emit('m', {side:cli.side, pos:pos});
    }.bind(this));
};

module.exports = ClientController;
