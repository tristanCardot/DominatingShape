/**@constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} s
 * @param {Shape} shape
 * @param {Color} color
 * @returns
 */
function Entity(range, angle, speed, shape, color){
	this.range = range;
	this.angle = angle;
	this.speed = speed;
	this.rotation = 0;

	this.shape = shape;
	this.color = color;
	this.strokeStyle = color.toString();
	this.fillStyle = color.evaluate(.4);
	
	this.scale = 0.01;
	
	this.phase = Entity.PHASE.SPAWN;
	this.time = 0;
}

Entity.prototype = {
	/**Met à jour l'entité.
	 * @param {Number} delta
	 */
	update : function(delta){
		switch(this.phase){
			case Entity.PHASE.SPAWN:
					this.time += delta;
					this.scale = this.time /75 +0.01;
					this.rotation += delta /150;
					
					if(this.time>750){
						this.time = 0;
						this.phase = Entity.PHASE.ALIVE;
					}
				break;
				
			case Entity.PHASE.ALIVE:
					this.range -= this.speed *delta;
					this.time += delta;
					this.rotation += delta *this.speed /( Math.PI *2);
					
					this.scale = 10 +Math.sin( this.time /75);
				break;
				
			case Entity.PHASE.DEAD:
				break;
		}
		return this.range < 0;
	},
	
	/**Dessine l'entitée. */
	draw : function(){
		var rangeX = this.range *Math.cos( this.angle) *SCALE.x;
		var rangeY = this.range *Math.sin( this.angle) *SCALE.y;
		
		CTX.fillStyle = this.fillStyle;
		CTX.strokeStyle = this.strokeStyle;

		CTX.translate( rangeX, rangeY);
		CTX.scale( this.scale *SCALE.min, this.scale *SCALE.min);

		CTX.rotate( this.rotation );
		
		this.shape.draw();
		
		CTX.rotate( -this.rotation );
		
		CTX.scale( 1/( this.scale *SCALE.min), 1 /( this.scale *SCALE.min));
		CTX.translate( -rangeX, -rangeY);
	}
};


/**@enum {Number}*/
Entity.PHASE = {
	SPAWN : 0,
	ALIVE : 1,
	DEAD : 2 
};