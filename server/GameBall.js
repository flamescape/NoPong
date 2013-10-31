var _ = require('underscore');

var GameBall = function() {
    _.defaults(this, {
        x: 0.5,
        y: 0.5,
        speed: 0,
        angle: 0
    });
};
GameBall.prototype.tick = function(deltaTime){
    while (this.angle >= Math.PI * 2) { this.angle -= (Math.PI * 2); }
    while (this.angle < 0) { this.angle += (Math.PI * 2); }
    
    var xm = Math.cos(this.angle) * this.speed;
    var ym = Math.sin(this.angle) * this.speed;
    
    
};


module.exports = GameBall;