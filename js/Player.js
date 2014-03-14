/**
 * @constructor
 */
function Player(){
	/**@type {Shape} */this.shape = new ShapeP( SHAPE.TRIANGLE );
	/**@type {Color} */this.color = new ColorP( COLOR.RED );
	/**@type {Particle} */this.particle = new Particle(this.shape, this.color, 400);
	
	/**@type {Cursor} */this.cursor = new Cursor();
	/**@type {Number} */this.score = 0;
	/**@type {number} */this.combo = 0;
}

Player.prototype = {
	/** Dessine le font.*/
	drawBackground : function(){
		var length = this.shape.rads.length -1;
		var max;
		
		if(CANVAS.height < CANVAS.width)
			max = CANVAS.width/1.33;

		else
			max = CANVAS.height/1.33;

		CTX.rotate(this.shape.rotation);
		CTX.globalAlpha = .55;
		
		for(var i=0, rad, toRad; i<length; i++){
			rad = this.shape.rads[i] -0.005;
			toRad = this.shape.rads[i+1];
			
			CTX.fillStyle = this.color.evaluate( this.shape.values[i]);
			
			CTX.beginPath();
			CTX.moveTo( 0, 0 );
			CTX.lineTo( Math.sin(rad) *max, -Math.cos(rad) *max );
			CTX.lineTo( Math.sin( ( rad +toRad ) /2) *max *2, -Math.cos( ( rad +toRad ) /2 ) *max *2 );
			CTX.lineTo( Math.sin(toRad) *max, -Math.cos(toRad) *max );
			CTX.closePath();
			CTX.fill();
		}

		CTX.globalAlpha = 1;
		CTX.rotate(-this.shape.rotation);
	},
	
	/**Mais à jour les paramétres liés au joueur/background.
	 * @param {Number} delta
	 */
	update : function(delta){
		this.shape.rotation += Math.PI /3000 *delta -controler.rotationSpeed;
		
		this.color.update(delta);
		this.shape.update(delta);
		
		this.particle.updateCtx();
		this.particle.update(delta);
		
		if(this.cursor.press){
			this.particle.add(this.cursor.x *SCALE.x, this.cursor.y *SCALE.y);
			
			var segment = this.cursor.getSegment();
			var list = em.getCollide(segment.from, segment.to);

			for(var i=0; i<list.length; i++)
				if(list[i].shape.id === this.shape.id  &&  list[i].color.id === this.color.id){
					em.remove(list[i]);	
					this.combo++;
					this.score += this.combo;
				}
		}
	},
	
	/**Transforme le joueur dans la couleur et forme de la prochaine cible.
	 * @param {Entity} target
	 */
	morphing : function(target){
		if(!target)
			return;

		this.shape.morphing(target.shape);
		this.color.morphing(target.color);
	},
	
	/**Dessine la forme centrale représentent le joueur. */
	draw : function(){
		CTX.fillStyle = this.color.evaluate(.4);
		CTX.strokeStyle = this.color.evaluate(1);

		this.particle.draw();
		this.shape.draw();

		CTX.fillStyle = this.color.evaluate(1);
		CTX.fillText( this.score, -CANVAS.width /2.05, -CANVAS.height /2.05 +( SCALE.x +SCALE.y)*6 );
	},
	
	/**Dessine la barre de progression. */
	drawFromProgress : function(progress){
		CTX.fillStyle = this.color.evaluate( .4);
		CTX.strokeStyle = this.color.evaluate( progress);

		this.shape.draw();

	},
	
	updateScore : function(){
		if( this.combo === 0)
			return;
		
		this.score += this.combo *this.combo;
		this.combo = 0;
		
		this.morphing( em.getTarget());
	}
};

/**Couleur propre au joueur.
 * @constructor
 * @param {Number} id
 */
function ColorP(id){
	var color = COLOR[id];
	
	this.id = color.id;
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

/**Mais à jour l'avancement de la transition de couleur si cela est nécessaire.
 * @param {Number} delta
 */
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
/**Initialise la transition de la couleur.
 * @param {Color} target
 */
ColorP.prototype.morphing = function(target){
	this.id = target.id;
	
	this.targetR = target.r;
	this.targetG = target.g;
	this.targetB = target.b;
	
	this.transition = 0;
};

/**Forme propre au joueur.
 * @param {Number} id
 * @returns
 */
function ShapeP(id){
	this.id = id;
	this.sides = SHAPE[id].vertex.length /2;

	this.transitionDelay = 1000;
	this.transition = 1000;
	
	this.rads = [];
	this.values = [];
	
	this.rotation = 0;
	this.scale = 10;
	
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
	/**Dessine la forme du joueur.*/
	draw : function(){
		CTX.rotate( this.rotation );
		CTX.scale( this.scale *SCALE.min, this.scale *SCALE.min);
		
		CTX.beginPath();
		
		CTX.moveTo( Math.sin(this.rads[0]), -Math.cos(this.rads[0]));

		for(var i=1; i<this.rads.length; i++)
			CTX.lineTo( Math.sin(this.rads[i]), -Math.cos(this.rads[i]));

		CTX.closePath();

		CTX.fill();
		CTX.stroke();
		
		CTX.scale( 1 /( this.scale *SCALE.min), 1/( this.scale *SCALE.min));
		CTX.rotate( -this.rotation );
	},
	
	/**Dessine une version minime de la forme joueur (particle).
	 * @param {CanvasRenderingContext2D} ctx*/
	fill : function(ctx){
		ctx.beginPath();
		
		ctx.moveTo( Math.sin( this.rads[0]) *2.5 *SCALE.min, -Math.cos( this.rads[0]) *2.5 *SCALE.min);

		for(var i=1; i<this.rads.length; i++)
			ctx.lineTo( Math.sin( this.rads[i]) *2.5 *SCALE.min, -Math.cos( this.rads[i]) *2.5 *SCALE.min);

		ctx.closePath();

		ctx.fill();
	},
	
	/**Initialise la transition de la forme.
	 * @param {Shape} target
	 */
	morphing : function(target){
		this.id = target.id;
		
		this.targetRads = [];
		this.targetValues = [];
		
		this.transition = 0;
		this.sides = target.vertex.length /2;
		
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
	
	/**Mais à jour la forme si nécessaire. */
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























