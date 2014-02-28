/**
 * @constructor
 */
function Player(){
	/**@type {Shape} */this.shape = new ShapeP( SHAPE.TRIANGLE );
	/**@type {Color} */this.color = new ColorP( COLOR.RED );
	/**@type {Particle} */this.particle = new Particle(this.shape, this.color, 400);
	
	/**@type {Cursor} */this.cursor = new Cursor();
}

Player.prototype = {
	drawBackground : function(){
		var length = this.shape.rads.length -1;

		CTX.rotate(this.shape.rotation);
		
		for(var i=0, rad, toRad; i<length; i++){
			rad = this.shape.rads[i]-0.005;
			toRad = this.shape.rads[i+1];
			
			CTX.fillStyle = this.color.evaluate( this.shape.values[i] );
			
			CTX.beginPath();
			CTX.moveTo( 0, 0 );
			CTX.lineTo( Math.cos(rad) *SIZESQRT, Math.sin(rad) *SIZESQRT );
			CTX.lineTo( Math.cos( ( rad +toRad ) /2) *SIZE *2, Math.sin( ( rad +toRad ) /2 ) *SIZE *2 );
			CTX.lineTo( Math.cos(toRad) *SIZESQRT, Math.sin(toRad) *SIZESQRT );
			CTX.closePath();
			CTX.fill();
		}

		CTX.rotate(-this.shape.rotation);
	},
	
	/**
	 * @param {Number} delta
	 */
	update : function(delta){
		this.shape.rotation += Math.PI/3000*delta;
		
		this.color.update(delta);
		this.shape.update(delta);
		
		this.particle.updateCtx();
		this.particle.update(delta);
		
		if(this.cursor.press){
			this.particle.add(this.cursor.x, this.cursor.y);
			
			var list = em.getCollide(this.cursor.x, this.cursor.y);
			
			for(var i=0; i<list.length; i++){
				if(list[i].color.id === this.color.id  &&  list[i].shape.id === this.shape.id){
					em.remove(list[i]);
				}
			}
		}
		
	},
	
	/** Dessine la forme centrale représentent le joueur. */
	draw : function(){
		CTX.fillStyle = this.color.evaluate(.4);
		CTX.strokeStyle = this.color.evaluate(1);

		this.shape.draw();
		this.particle.draw();
	}
};

/**@constructor
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 */
function ColorP(id){
	var color = COLOR[id];
	
	this.id = color.id
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;
	
	this.transitionDelay = 1000;
	this.transition = 1000;

	this.targetR = color.r;
	this.targetG = color.g;
	this.targetB = color.b;
	
	delete color;
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
			var progress = Math.sin( this.transition /this.transitionDelay );
			
			this.r = ( this.targetR -this.r ) *progress +this.r;
			this.g = ( this.targetG -this.g ) *progress +this.g;
			this.b = ( this.targetB -this.b ) *progress +this.b;
		}
	}
};

ColorP.prototype.morphing = function(target){
	this.id = target.id;
	
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
	
	this.rotation = 0;
	this.scale = 20;
	
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
		CTX.rotate( this.rotation );
		CTX.scale( this.scale, this.scale);
		
		CTX.beginPath();
		
		CTX.moveTo( Math.cos(this.rads[0]), Math.sin(this.rads[0]));

		for(var i=1; i<this.rads.length; i++)
			CTX.lineTo( Math.cos(this.rads[i]), Math.sin(this.rads[i]));

		CTX.closePath();

		CTX.fill();
		CTX.stroke();
		
		CTX.scale( 1 /this.scale, 1/this.scale );
		CTX.rotate( -this.rotation );
	},
	
	fill : function(ctx){
		ctx.beginPath();
		
		ctx.moveTo( Math.cos(this.rads[0])*4, Math.sin(this.rads[0])*4);

		for(var i=1; i<this.rads.length; i++)
			ctx.lineTo( Math.cos(this.rads[i])*4, Math.sin(this.rads[i])*4);

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
				var progress = Math.sin( this.transition /this.transitionDelay );

				for(; i<this.rads.length; i++)
					this.rads[i] = (this.targetRads[i] -this.rads[i]) *progress +this.rads[i];
				
				for(i=0; i<this.values.length; i++)
					this.values[i] = (this.targetValues[i] -this.values[i]) *progress +this.values[i];
			}
		}
	}
};










