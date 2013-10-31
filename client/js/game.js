var gWidth = 800;
var gHeight = 600;
var gMargin = 20;
var pWidth = 15;
var pHeight = 80;

var socket = io.connect();
socket.on('startGame', function(roomState){
    console.log('Room State', roomState);
    document.getElementById("roomid").innerHTML = "Room: " + roomState.roomNumber;
    
    socket.emit('m', 0.5);
    
    socket.on('m', function(data){
        player2.setAttr('y', data.pos*gHeight);
        //console.log('Some paddle moved', data);
    });
    
    socket.on('b', function(data){
        ball.setAttr('x', gWidth*data.x);
        ball.setAttr('y', gHeight*data.y);
        //console.log('The ball moved (bounced?)', data);
    });
});

var stage = new Kinetic.Stage({
    container: 'container',
    width: gWidth,
    height: gHeight
});

var layer = new Kinetic.Layer({
    fill: 'red'
});

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
    draggable: true
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

stage.on('mouseout', function() {
    document.body.style.cursor = "default";
});

stage.on('mousemove', function() {
    document.body.style.cursor = "none";
    var mousePos = stage.getMousePosition();
    var pPos = mousePos.y - (pHeight/2);
    player1.setAttr('y', pPos);
    socket.emit('m', pPos/gHeight);
});

var gameInterval = setInterval(function(){gameLoop();}, 50);

var gameLoop = function() {
    layer.batchDraw();
};
