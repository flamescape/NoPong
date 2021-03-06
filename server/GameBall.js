var _ = _ || require('underscore')
  , SAT = SAT || require('./SAT')
  , sound = sound || {}
  ;

var GameBall = function() {
    _.defaults(this, {
        x: 0.5,
        y: 0.5,
        radius: 0.02,
        speed: 0,
        angle: 0,
        fps: 60
    });
    this.paddles = [];
    this.collisionCircle = new SAT.Circle(new SAT.Vector(this.x, this.y), this.radius);
    this.collisionResponse = new SAT.Response();
    this.onCollide = function(){};
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
            this.onCollide(1);
        }
        
        return newM;
    },
    
    tick: function(cb){
        var delta = this.calcDelta();
        if (!delta) {
            // delta === 0 ? no time has passed.
            // delta === null ? nothing to calculate.
            return cb&&cb();
        }
    
        this.collisionCircle.r = this.radius;
        this.collisionCircle.pos.x = this.x;
        this.collisionCircle.pos.y = this.y;

        while (this.angle > Math.PI) { this.angle -= Math.PI; }
        while (this.angle < -Math.PI) { this.angle += Math.PI; }
            
        var xm = Math.cos(this.angle) * this.speed * delta;
        var ym = Math.sin(this.angle) * this.speed * delta;

        if (this.server) {
        
            // check for paddle collisions
            this.paddles.forEach(function(paddle){
                var collision = SAT.testPolygonCircle(paddle.getCollisionPolygon(), this.collisionCircle, this.collisionResponse);
                if (collision) {
                    // calculate reflection vector based on current direction
                    var reflection = this.collisionResponse.overlapV.reflect(new SAT.V(xm, ym));
                
                    xm = this.collisionResponse.overlapV.x;
                    ym = this.collisionResponse.overlapV.y;
                    
                    // add reflection vector to xm + ym
                    xm += reflection.x;
                    ym += reflection.y;
                    
                    // set new angle to the reflection vector
                    this.angle = Math.atan2(ym, xm);
                    //console.log('Collide!', this.collisionResponse);
                    this.collisionResponse.clear();
                    this.onCollide(2);
                }
            }.bind(this));
            
            // check for wall collisions
            ym = this.collideWall(ym, 1, false);
            ym = this.collideWall(ym, 0, false);
            xm = this.collideWall(xm, 1, true);
            xm = this.collideWall(xm, 0, true);
        
        }
        
        this.x += xm;
        this.y += ym;
        
        return cb&&cb();
    },
    
    // only the client should ever call this function
    cliGetShape: function() {
        if (!this._kShape) {
            // create shape. (position & dims are temporary. real values computed on draw)
            this._kShape = new Kinetic.Rect({
                width: 1,
                height: 1,
                x: 1,
                y: 1,
                fill: "#FFF"
            });
            
            layer.add(this._kShape);
        }
        
        return this._kShape;
    }
    
};

(typeof module !== 'undefined') && (module.exports = GameBall);
