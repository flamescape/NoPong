var LocalController = function(socket, stage){
    // mouse position on the stage should control this paddle
    stage.on('mousemove', function(){
        this.lastPos = stage.getMousePosition().y / stage.getHeight(); // this is called a "unit interval"
        
        socket.emit('m', this.lastPos);
    }.bind(this));
};
