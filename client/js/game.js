
var socket = io.connect();

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

var rect = new Kinetic.Rect({
    x: 239,
    y: 75,
    width: 100,
    height: 50,
    fill: 'pink',
    stroke: 'black',
    strokewidth: 1
});

layer.add(bg);
layer.add(rect);

stage.add(layer);
