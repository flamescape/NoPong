var _ = _ || require('underscore');

var Paddle = function(x) {
    _.defaults(this, {
        height:  2/15,  //0.13333 repeating of course
        width:  3/160,  //0.01875
        x: x,
        y: 0.5
    });
};

Paddle.prototype.clamp = function() {
    var topBound = height/2;
    var botBound = 1 - height/2;
    
    if (y > botBound) {
        y = botBound;
    } else if (y < topBound) {
        y = topBound;
    }
};

Paddle.prototype.rect = new Kinetic.Rect({
    x: null,
    y: null,
    width: null,
    height: null,
    fill: '#FFF',
});

Paddle.prototype.resize = function(w, h) {
    this.rect.setWidth(this.width * w);
    this.rect.setHeight(this.height * h);
    //p.rect.setX((p.x - (p.width / 2)) * gWidth);
};
