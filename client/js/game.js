
var socket = io.connect();
socket.on('startGame', function(roomState){
    console.log('Room State', roomState);
    document.getElementById("roomid").innerHTML = "Room: " + roomState.roomNumber;
});

var stage = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 600
});

var layer = new Kinetic.Layer({
    fill: 'red'
});

var bg = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    fill: '#111'
});

var player1 = new Kinetic.Rect({
    x: 20,
    y: 75,
    width: 15,
    height: 80,
    fill: '#FFF',
    stroke: 'black',
    strokewidth: 1
});

var player2 = new Kinetic.Rect({
    x: 800-40,
    y: 205,
    width: 15,
    height: 80,
    fill: '#FFF',
    stroke: 'black',
    strokewidth: 1
});

layer.add(bg);
layer.add(player1);
layer.add(player2);

stage.add(layer);
