var RemoteController = function(socket, side){
    this.lastPos = 0.5; // default

    socket.on('m', function(data){
        // a remote paddle moved !!!
        if (data.side !== side)
            return; // this is not the paddle you were looking for
        
        // ok, here's the complicated bit:
        this.lastPos = data.pos;
    }.bind(this));
};
