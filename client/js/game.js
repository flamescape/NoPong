var gWidth = 800;
var gHeight = 600;
var gMargin = 20;
var pWidth = 15;
var pHeight = 80;

var socket = io.connect();
socket.on('startGame', function(roomState){
    console.log('Room State', roomState);
    document.getElementById("roomid").innerHTML = "Room: " + roomState.roomNumber;
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

stage.on('mousemove', function() {
    var mousePos = stage.getMousePosition();
    player1.setAttr('y', mousePos.y);
    layer.batchDraw();
});
