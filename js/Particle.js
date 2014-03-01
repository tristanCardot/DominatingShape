function Particle(shape, color, lifeTime){
	this.ctx = document.createElement('canvas').getContext('2d');
	this.ctx.canvas.height = 10;
	this.ctx.canvas.width = 10;
	
	this.list = [];
	
	this.shape = shape;
	this.color = color;
	this.lifeTime = lifeTime;
	
	this.updateCtx();
}

Particle.prototype = {
	updateCtx : function(){
		this.ctx.fillStyle = this.color.evaluate(.5);

		this.ctx.clearRect( 0, 0, 10, 10 );
		this.ctx.translate(5,5);
		
		this.shape.fill( this.ctx );
		
		this.ctx.translate(-5, -5);
	},

	add : function( x, y, speed, vec){
		this.list.push([
		    x,
		    y,
		    speed || 0.04,
		    vec || Math.random() *PI2,
		    this.lifeTime
		]);
	},

	update : function(delta){
		for(var i=0, s; i<this.list.length; i++){
			s = this.list[i];

			s[4] -= delta;
			
			if( s[4] < 1 ){
				this.list.splice( i, 1 );
				i--;
			
			}else{
				s[0] += Math.cos(s[3]) *s[2] *delta;
				s[1] += Math.sin(s[3]) *s[2] *delta;
			}
		}
	},

	draw : function(){
		if( this.list.length > 0  &&  this.list[this.list.length-1][4] < 250 )
			CTX.globalAlpha = this.list[this.list.length-1][4] /250;
		
		for(var i=0; i<this.list.length; i++)
			CTX.drawImage(this.ctx.canvas,
				this.list[i][0],
				this.list[i][1]
			);
		
		CTX.globalAlpha = 1;
	}
};