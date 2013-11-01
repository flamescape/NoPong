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
GameBall.prototype = {

    addCollidingPaddle: function(paddle) {
        this.paddles.push(paddle);
        return this;
    },
    
    update: function(data) {
        _.isObject(data) && _.extend(this, data || {});
        return this;
    },
    
    calcDelta: function(){
        var delta;
        if (this.prevTick) {
            delta = Date.now() - this.prevTick;
        }
        this.prevTick = Date.now();
        return delta && delta / (1000/this.fps);
    },
    
    tick: function(){
        var delta = this.calcDelta();
        if (!delta) {
            // delta === 0 ? no time has passed.
            // delta === null ? nothing to calculate.
            return;
        }        

        while (this.angle > Math.PI) { this.angle -= Math.PI; }
        while (this.angle < -Math.PI) { this.angle += Math.PI; }
        
        var xm = Math.cos(this.angle) * this.speed * delta;
        var ym = Math.sin(this.angle) * this.speed * delta;
        
        // check for paddle collisions
        this.paddles.forEach(function(){
            // todo: see comment ^
        });
        
        // check for wall collisions
        if (this.y + ym > 1) {
            var overshoot = (this.y + ym) - 1;
            var close = 1 - this.y;
            ym = close - overshoot;
            this.angle = -this.angle;
        }
        
        if (this.x + xm > 1) {
            var overshoot = (this.x + xm) - 1;
            var close = 1 - this.x;
            xm = close - overshoot;
            this.angle = (this.angle >= 0 ? Math.PI : -Math.PI) - this.angle;
        }
        
        if (this.y + ym < 0) {
            var overshoot = (this.y + ym) - 0;
            var close = 0 - this.y;
            ym = close - overshoot;
            this.angle = -this.angle;
        }
        
        if (this.x + xm < 0) {
            var overshoot = (this.x + xm) - 0;
            var close = 0 - this.x;
            xm = close - overshoot;
            this.angle = (this.angle >= 0 ? Math.PI : -Math.PI) - this.angle;
        }
        
        this.x += xm;
        this.y += ym;
    }
};

typeof module !== 'undefined' && (module.exports = GameBall);