var _ = _ || require('underscore')
  , SAT = SAT || require('./SAT')
  ;

var Paddle = function(info, controller) {
    _.defaults(this, {
        height:  2/15,  // 0.13333 repeating of course
        width:  3/160,  // 0.01875
        x: 0.5          // this will almost always be overwritten
    });
    _.extend(this, info || {});
    this.controller = controller;
    this.collisionBox = new SAT.Box(new SAT.Vector(this.x,this.y), this.width, this.height);
};

Paddle.prototype.getCollisionPolygon = function(){
    this.collisionBox.pos.x = this.x - (this.width / 2);
    this.collisionBox.pos.y = this.getPosition() - (this.height / 2);
    this.collisionBox.width = this.width;
    this.collisionBox.height = this.height;
    return this.collisionBox.toPolygon(); // could probably cache this polygon if nothing has changed
};

Paddle.prototype.getPosition = function() {
    return this._clamp(this.controller.lastPos);
};

Paddle.prototype._clamp = function(y) {
    // let's not make things any more complicated than they need to be
    return Math.min(1 - (this.height / 2), Math.max(y, this.height / 2));
};

// only the client should ever call this function
Paddle.prototype.cliGetShape = function(layer){
    if (!this._kShape) {
        // create shape. (position & dims are temporary. real values computed on draw)
        this._kShape = new Kinetic.Rect({
            x: 1,
            y: 1,
            width: 1,
            height: 1,
            fill: '#FFF'
        });
        
        layer.add(this._kShape);
    }
    
    return this._kShape;
};

(typeof module !== 'undefined') && (module.exports = Paddle);
