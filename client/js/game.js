var gRatio = 16 / 9;
var gWidth = document.width; //Game window width
var gHeight = parseInt(gWidth / gRatio); //Game window height

var sound = {
    bip: new Audio('audio/bip.wav'),
    boop: new Audio('audio/boop.wav')
};

// set up stage
var stage = new Kinetic.Stage({
    container: 'container',
    width: gWidth,
    height: gHeight,
});
var layer = new Kinetic.Layer();
var bg = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: gWidth,
    height: gHeight,
    fill: '#110'
});
layer.add(bg);
stage.add(layer);

// the key elements of the game:
var gameBall = new GameBall();
var paddles = [];

// connect to server
var socket = io.connect();
socket.on('enterRoom', function(roomState){
    console.log('Room State', roomState);
    document.getElementById("roomid").innerHTML = "Room: " + roomState.roomNumber;
    
    paddles = roomState.competitors.map(function(competitorInfo){
        // this paddle is controlled by what?
        var controller = (competitorInfo.side === roomState.yourSide)
                       ? new LocalController(socket, stage)
                       : new RemoteController(socket, competitorInfo.side);
                       
        // create the paddle
        var paddle = new Paddle(competitorInfo, controller);
        gameBall.addCollidingPaddle(paddle); // the ball should be wary of this paddle
        return paddle;
    });
    
    socket.on('b', function(data){
        gameBall.update(data);
    });
    
    socket.on('c', function(what){
        switch (what) {
            case 1: sound.bip.play(); break;
            case 2: sound.boop.play(); break;
        }
    });
});

var gamePhysics = function() {
    gameBall.tick();
};
    
var gameDraw = function() {

    paddles.forEach(function(paddle){
        paddle.cliGetShape(layer).setAttrs({
            offsetX: (paddle.width / 2) * gWidth,
            offsetY: (paddle.height / 2) * gHeight,
            x: paddle.x * gWidth,
            y: paddle.getPosition() * gHeight,
            width: paddle.width * gWidth,
            height: paddle.height * gHeight
        });
    });
    
    gameBall.cliGetShape(layer).setAttrs({
        offsetX: (gameBall.radius / 2) * gWidth,
        offsetY: (gameBall.radius / 2) * gWidth,
        x: gameBall.x * gWidth,
        y: gameBall.y * gHeight,
        width: gameBall.radius * gWidth,
        height: gameBall.radius * gWidth
    });
    
    //batchDraw() is limited by the maximum browser fps
    //  See http://www.html5canvastutorials.com/kineticjs/html5-canvas-kineticjs-batch-draw/
    layer.batchDraw();
};

// this is the game loop:
setInterval(function() {
                    // input is processed asynchronously, so does not need to be in the game loop
    gamePhysics();  // movements & collisions
    gameDraw();     // recalculate ball & paddle positions & dims
}, 1000/60);
