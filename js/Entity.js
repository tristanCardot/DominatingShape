/**@constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Object} vec
 * @param {Shape} shape
 * @param {Color} color
 * @returns
 */
function Entity(x, y, vec, shape, color){
	this.x = x;
	this.y = y;
	this.vec = vec;
	this.shape = shape;
	this.color = color;
	this.strokeStyle = color.toString();
	this.fillStyle = color.evaluate(.4);
	this.rotation = 0;
	this.scale = 3;
	this.time = 0;
}

Entity.prototype = {
	/**Met à jour l'entité.
	 * @param {Number} delta
	 */
	update : function(delta){
		this.x += delta *this.vec.x;
		this.y += delta *this.vec.y;
		this.rotation += delta/1000;
		this.time += delta;
		this.scale = 2+ Math.sin(this.time/(600)) /4;
		
	},
	
	/**Dessine l'entitée. */
	draw : function(){
		CTX.fillStyle = this.fillStyle;
		CTX.strokeStyle = this.strokeStyle;

		this.shape.drawOnPos(this.x, this.y, this.rotation, this.scale);
	}
};