var gWidth = 800; //Game window width
var gHeight = 600; //Game window height
var gMargin = 20; //Game window side margins
var pWidth = 15; //Player paddle width
var pHeight = 80; //Player paddle height

var gameBall = new GameBall();
gameBall.update({speed:0.004, angle: 1});

var socket = io.connect();
socket.on('startGame', function(roomState){
    console.log('Room State', roomState);
    console.log(roomState);
    document.getElementById("roomid").innerHTML = "Room: " + roomState.roomNumber;
    
    socket.emit('m', 0.5);
    
    socket.on('m', function(data){
        player2.setAttr('y', data.pos * gHeight);
        //console.log('Some paddle moved', data);
    });
    
    socket.on('b', function(data){
        gameBall.update(data);
        console.log('The ball moved (bounced?)', data);
    });
});

var stage = new Kinetic.Stage({
    container: 'container',
    width: gWidth,
    height: gHeight
});

var layer = new Kinetic.Layer();

var bg = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: gWidth,
    height: gHeight,
    fill: '#111'
});

var player1 = new Kinetic.Rect({
    x: gMargin,
    y: 75, //arbitrary number for now
    width: pWidth,
    height: pHeight,
    fill: '#FFF',
    stroke: 'black',
    strokewidth: 1,
});

var player2 = new Kinetic.Rect({
    x: gWidth - (gMargin + pWidth),
    y: 205, //arbitrary number for now
    width: pWidth,
    height: pHeight,
    fill: '#FFF',
    stroke: 'black',
    strokewidth: 1
});

var ball = new Kinetic.Ellipse({
    radius: 7.5,
    x: 100,
    y: 100,
    fill: "#FFF"
});

layer.add(bg);
layer.add(player1);
layer.add(player2);
layer.add(ball);

stage.add(layer);

var gameLoop = function() {
    if (stage.getMousePosition() !== undefined) {
        var mousePos = stage.getMousePosition();
        var pPos;

        //Let's prevent the paddle from going out of bounds
        if (pHeight / 2 > mousePos.y) {
            pPos = 0;
        } else if (pHeight / 2 > (gHeight - mousePos.y)) {
            pPos = gHeight - pHeight;
        } else {
            pPos = mousePos.y - (pHeight/2);
        }

        //Update the paddle position and send it to Gareth's shitty server
        player1.setAttr('y', pPos);
        socket.emit('m', pPos / gHeight);
    }
    
    //batchDraw() is limited by the maximum browser fps
    //  See http://www.html5canvastutorials.com/kineticjs/html5-canvas-kineticjs-batch-draw/
    gameBall.tick();
    ball.setAttr('x', gWidth * gameBall.x);
    ball.setAttr('y', gHeight * gameBall.y);
    
    layer.batchDraw();
};

setInterval(gameLoop, 1000/60);
