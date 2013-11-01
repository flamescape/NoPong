var _ = _ || require('underscore');

var Paddle = function() {
    _.defaults(this, {
        height:  2/15,  //0.13333 repeating of course
        width:  3/160,  //0.01875
        x: null,
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
