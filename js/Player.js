/**
 * @constructor
 */
function Player(){
	/**@type {Shape}*/this.shape = new ShapeP(SHAPE.TRIANGLE);
	/**@type {Color}*/this.fromColor = COLOR[0];
	/**@type {Color}*/this.color = new ColorP(255,0,0);
}

Player.prototype = {
	drawBackground : function(){

		var length = this.shape.rads.length -1;

		for(var i=0, rad, toRad; i<length; i++){
			rad = this.shape.rads[i];
			toRad = this.shape.rads[i+1] +0.01;
			
			CTX.fillStyle = this.color.evaluate( this.shape.values[i] );
			
			CTX.beginPath();
			CTX.moveTo( -Math.cos(rad), -Math.sin(rad) );
			CTX.lineTo( Math.cos(rad) *SIZESQRT, Math.sin(rad) *SIZESQRT);
			CTX.lineTo( Math.cos( ( rad +toRad ) /2) *SIZE *2, Math.sin( ( rad +toRad ) /2 ) *SIZE *2);
			CTX.lineTo( Math.cos(toRad) *SIZESQRT, Math.sin(toRad) *SIZESQRT);
			CTX.closePath();
			CTX.fill();
		}
	},
	
	/**
	 * @param {Number} delta
	 */
	update : function(delta){
		this.color.update(delta);
		this.shape.update(delta);
	},
	
	/** Dessine la forme centrale représentent le joueur. */
	draw : function(){
		CTX.fillStyle = this.color.evaluate(.4);
		CTX.strokeStyle = this.color.evaluate(1);
		this.shape.draw();
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
	
	this.transitionDelay = 1000;
	this.transition = 1000;

	this.targetR = r;
	this.targetG = g;
	this.targetB = b;
}

ColorP.prototype = Color.prototype;

ColorP.prototype.update = function(delta){
	if( this.transition < this.transitionDelay ){
		this.transition += delta;
		
		if( this.transition >= this.transitionDelay ){
			this.r = this.targetR;
			this.g = this.targetG;
			this.b = this.targetB;
		
		}else{
			var progress = this.transition /this.transitionDelay;
			
			this.r = ( this.targetR -this.r ) *progress +this.r;
			this.g = ( this.targetG -this.g ) *progress +this.g;
			this.b = ( this.targetB -this.b ) *progress +this.b;
		}
	}
};

ColorP.prototype.morphing = function(target){
	this.targetR = target.r;
	this.targetG = target.g;
	this.targetB = target.b;
	
	this.transition = 0;
};

function ShapeP(id){
	this.id = id;
	this.sides = SHAPE[id].vertex.length /2;

	this.transitionDelay = 1000;
	this.transition = 1000;
	
	this.rads = [];
	this.values = [];
	
	for(var i=0; i<this.sides; i++){
		this.rads.push(PI2 /this.sides *i);
		this.values.push(.1 +( i %2 ) /20);
	}
	
	if(this.sides%2 === 1)
		this.values[ this.values.length-1 ] = .125;

	this.rads.push(PI2);

	this.targetValues = this.values;
	this.targetRads = this.rads;
}

ShapeP.prototype = {
		
	draw : function(){
		CTX.scale(2.2,2.2);
		
		CTX.beginPath();
		
		CTX.moveTo( Math.cos(this.rads[0])*10, Math.sin(this.rads[0])*10);

		for(var i=1; i<this.rads.length; i++)
			CTX.lineTo( Math.cos(this.rads[i])*10, Math.sin(this.rads[i])*10);

		CTX.closePath();

		CTX.fill();
		CTX.stroke();
		
		CTX.scale(1/2.2, 1/2.2);
	},
	
	fill : function(ctx){
		ctx.beginPath();
		
		ctx.moveTo( Math.cos(this.rads[0])*10, Math.sin(this.rads[0])*10);

		for(var i=1; i<this.rads.length; i++)
			ctx.lineTo( Math.cos(this.rads[i])*10, Math.sin(this.rads[i])*10);

		ctx.closePath();

		ctx.fill();
	},
	
	morphing : function(id){
		this.id = id;
		
		this.targetRads = [];
		this.targetValues = [];
		
		this.transition = 0;
		this.sides = SHAPE[id].vertex.length /2;
		
		var min,max,overflow,i,index;

		for(i=0; i<this.sides; i++){
			this.targetRads.push(PI2 /this.sides *i);
			this.targetValues.push(.1 +( i %2 ) /20);
		}
		
		if(this.sides%2 === 1)
			this.targetValues[ this.targetValues.length-1 ] = .125;
		
		this.targetRads.push(PI2);
		
		
		if(this.rads.length !== this.targetRads.length){
			if( this.rads.length < this.targetRads.length ){
				min = this.rads;
				max = this.targetRads;
				
			}else{
				min = this.targetRads;
				max = this.rads;
			}

			overflow = max.length -min.length;

			for(i=0; i<overflow; i++){
				index = Math.round( min.length /overflow *i );
				min.splice(index, 0, min[index]);
			}
			
			
			if( this.values.length < this.targetValues.length ){
				min = this.values;
				max = this.targetValues;
				
			}else{
				min = this.targetValues;
				max = this.values;
			}
			
			overflow = max.length -min.length;

			for(i=0; i<overflow; i++){
				index = Math.round( min.length /overflow *i );
				min.splice(index, 0, min[index]);
			}
		}
	},

	update : function(delta){
		if( this.transition < this.transitionDelay ){
			this.transition += delta;
			var i=0;

			if( this.transition >= this.transitionDelay ){
				this.rads = [];
				this.values = [];
				
				for(; i<this.targetRads.length; i++)
					if( this.targetRads[i] !== this.targetRads[i-1] )
						this.rads.push( this.targetRads[i] );
				
				for(i=0; i<this.targetValues.length; i++)
					if( this.targetValues[i] !== this.targetValues[i-1] )
						this.values.push( this.targetValues[i] );

			}else{
				var progress = this.transition /this.transitionDelay;

				for(; i<this.rads.length; i++)
					this.rads[i] = (this.targetRads[i] -this.rads[i]) *progress +this.rads[i];
				
				for(i=0; i<this.values.length; i++)
					this.values[i] = (this.targetValues[i] -this.values[i]) *progress +this.values[i];
			}
		}
	}
};










