
var socket = io.connect();

var stage = new Kinetic.Stage({
    container: 'container',
    width: 578,
    height: 200
});

var layer = new Kinetic.Layer();

var rect = new Kinetic.Rect({
    x: 239,
    y: 75,
    width: 100,
    height: 50,
    fill: 'pink',
    stroke: 'black',
    strokewidth: 1
});

layer.add(rect);

stage.add(layer);
