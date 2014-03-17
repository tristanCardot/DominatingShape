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
	this.time = 1;
}

Entity.prototype = {
	/**Met à jour l'entité.
	 * @param {Number} delta
	 */
	update : function(delta){
		this.angle += controler.angleSpeed *delta;
		this.time += delta;

		switch(this.phase){
			case Entity.PHASE.SPAWN:
					this.scale = ( this.time /750) *( controler.scale);
					this.rotation += delta /150;
					
					if(this.time>750){
						this.time = 0;
						this.phase = Entity.PHASE.ALIVE;
					}
				break;
				
			case Entity.PHASE.ALIVE:
					this.range -= this.speed *delta;
					this.rotation += delta *controler.rotationSpeed;

					this.scale = controler.scale;
				break;
		}
		return this.range < 0;
	},
	
	/**Dessine l'entité. */
	draw : function(){
		var rangeX = this.range *Math.cos( this.angle) *SCALE.x,
			rangeY = this.range *Math.sin( this.angle) *SCALE.y,
			scaleM = this.scale *SCALE.min;
		
		CTX.fillStyle = this.fillStyle;
		CTX.strokeStyle = this.strokeStyle;

		CTX.translate( rangeX, rangeY);
		CTX.scale( scaleM, scaleM);
		CTX.rotate( this.rotation );
		
		this.shape.draw();
		
		CTX.rotate( -this.rotation );
		CTX.scale( 1 /scaleM, 1 /scaleM);
		CTX.translate( -rangeX, -rangeY);
	}
};


/**@enum {Number}*/
Entity.PHASE = {
	SPAWN : 0,
	ALIVE : 1
};