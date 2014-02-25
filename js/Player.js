/**
 * @constructor
 */
function Player(){
	/**@type {Shape}*/this.shape = SHAPE[0];
	/**@type {Color}*/this.fromColor = COLOR[0];
	/**@type {Color}*/this.color = new ColorP(255,0,0);
}

Player.prototype = {
	drawBackground : function(){
	},
	
	update : function(delta){
		this.color.update(delta);
		
		CTX.fillStyle = this.color.evaluate(.4);
		CTX.strokeStyle = this.color.evaluate(1);
		this.shape.drawOnPos(this.x, this.y, 0, 2.0);
	},
	
	morphShape : function(){
		
	}
	
	
	
};

/**@constructor
 * @param {Number} r 
 * @param {Number} g
 * @param {Number} b
 */
function ColorP(r, g, b){
	this.r = r;
	this.g = g;
	this.b = b;
	
	this.transitionDelay = 250;
	this.transition = 0;

	this.toR = r;
	this.toG = g;
	this.toB = b;
	
	this.fromR = r;
	this.fromG = g;
	this.fromB = b;
}

ColorP.prototype = Color.prototype;

ColorP.prototype.update = function(delta){
	this.transition += delta;
	
	if( this.transition < this.transitionDelay ){
		var progress = this.transition /this.transitionDelay;
		
		this.r = ( this.toR -this.fromR ) *progress +this.fromR;
		this.g = ( this.toG -this.fromG ) *progress +this.fromG;
		this.b = ( this.toB -this.fromB ) *progress +this.fromB;

	}else{
		this.r = this.toR;
		this.g = this.toG;
		this.b = this.toB;
	}
		
};

ColorP.prototype.pushTransition = function(target){
	this.fromR = this.r;
	this.fromG = this.g;
	this.fromB = this.b;
	
	this.toR = target.r;
	this.toG = target.g;
	this.toB = target.b;
	
	this.transition = 0;
};

function ShapeP(vertex){
	
	
}

ShapeP.prototype = Shape.prototype;

