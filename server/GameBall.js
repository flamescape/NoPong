var _ = _ || require('underscore');

var GameBall = function() {
    _.defaults(this, {
        x: 0.5,
        y: 0.5,
        speed: 0,
        angle: 0,
        fps: 60
    });
    this.paddles = [];
};
GameBall.prototype.addCollidingPaddle = function(paddle) {
    this.paddles.push(paddle);
    return this;
};
GameBall.prototype.update = function(data) {
    _.isObject(data) && _.extend(this, data || {});
    return this;
};
GameBall.prototype.calcDelta = function(){
    var delta;
    if (this.prevTick) {
        delta = Date.now() - this.prevTick;
    }
    this.prevTick = Date.now();
    return delta && delta / (1000/this.fps);
};
GameBall.prototype.tick = function(){
    var delta = this.calcDelta();
    if (!delta) {
        // delta === 0 ? no time has passed.
        // delta === null ? nothing to calculate.
        return;
    }        

    while (this.angle >= Math.PI * 2) { this.angle -= (Math.PI * 2); }
    while (this.angle < 0) { this.angle += (Math.PI * 2); }
    
    var xm = Math.cos(this.angle) * this.speed * delta;
    var ym = Math.sin(this.angle) * this.speed * delta;
    
    // check for paddle collisions
    this.paddles.forEach(function(){
        // todo: see comment ^
    });
    
    // check for wall collisions
    // todo: see comment ^
    
    this.x += xm;
    this.y += ym;
};

typeof module !== 'undefined' && (module.exports = GameBall);