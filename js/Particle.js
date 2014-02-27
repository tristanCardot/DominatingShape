function Particle(shape, color, lifeTime){
	this.ctx = document.createElement('canvas').getContext('2d');
	this.ctx.canvas.height = 20;
	this.ctx.canvas.width = 20;
	
	this.list = [];
	
	this.shape = shape;
	this.color = color;
	this.lifeTime = lifeTime;
	
	this.drawModel;
}

Particle.prototype = {
	updateCtx : function(){
		this.ctx.fillStyle = color.toString();

		this.ctx.clearRect( 0, 0, 20, 20 );
		this.shape.fill( this.ctx );
	},

	add : function( x, y, speed, vec){
		this.list.push([
		    x,
		    y,
		    speed || 2.5,
		    vec || Math.random()*PI2
		]);
	},

	update : function(delta){
		for(var i=0, s; i<this.list.length; i++){
			s = this.list[i];

			s.x += Math.cos(s.vec) *s.speed;
			s.y += Math.sin(s.vec) *s.speed;
		}
	},

	draw : function(){
		for(var i=0; i<this.list.length; i++)
			CTX.draw(this.ctx.canvas,
				this.list[i][0],
				this.list[i][1]
			);
	}
};