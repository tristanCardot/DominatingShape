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

	this.shape = shape;
	this.color = color;
	this.strokeStyle = color.toString();
	this.fillStyle = color.evaluate(.4);
	this.scale = 2;
	this.time = 0;
}

Entity.prototype = {
	/**Met à jour l'entité.
	 * @param {Number} delta
	 */
	update : function(delta){
		this.range -= this.speed *delta;
		this.time += delta;
		this.scale = 2 +Math.sin( this.time /100) /2;
		
		return this.range < 0;
	},
	
	/**Dessine l'entitée. */
	draw : function(){
		CTX.fillStyle = this.fillStyle;
		CTX.strokeStyle = this.strokeStyle;

		CTX.rotate( this.angle );
		CTX.translate( this.range, 0);
		CTX.scale(this.scale, this.scale);

		this.shape.draw();
		
		CTX.scale(1/this.scale, 1/this.scale);
		CTX.translate( -this.range, 0);
		CTX.rotate( -this.angle );
	}
};