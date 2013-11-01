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
    
    collideWall: function(dm, wp, horiz) {
        var t0 = horiz ? this.x : this.y
          , t1 = t0 + dm
          , after = t1 - wp
          , before = wp - t0
          , newM = dm
          ;
        
        if ((t1 > wp && wp > t0) || (t1 < wp && wp < t0)) {
            newM = before - after;
            if (horiz) {
                this.angle = (this.angle >= 0 ? Math.PI : -Math.PI) - this.angle;
            } else {
                this.angle = -this.angle;
            }
        }
        
        return newM;
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
        ym = this.collideWall(ym, 1, false);
        ym = this.collideWall(ym, 0, false);
        xm = this.collideWall(xm, 1, true);
        xm = this.collideWall(xm, 0, true);
        
        
        this.x += xm;
        this.y += ym;
    }
};

typeof module !== 'undefined' && (module.exports = GameBall);