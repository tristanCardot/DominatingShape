function Particle(shape, color, lifeTime){
	this.ctx = document.createElement('canvas').getContext('2d');
	this.ctx.canvas.height = 8 *SCALE.min +1;
	this.ctx.canvas.width = 8 *SCALE.min +1;
	
	this.list = [];
	
	this.shape = shape;
	this.color = color;
	this.lifeTime = lifeTime;
	
	this.updateCtx();
}

Particle.prototype = {
	updateScale : function(){
		this.ctx.canvas.height = 10 *SCALE.min +1;
		this.ctx.canvas.width = 10 *SCALE.min +1;
	},
		
	updateCtx : function(){
		this.ctx.fillStyle = this.color.evaluate(1);

		this.ctx.clearRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.translate( this.ctx.canvas.width/2, this.ctx.canvas.height/2);
		
		this.shape.fill( this.ctx );
		
		this.ctx.translate(-this.ctx.canvas.width/2, -this.ctx.canvas.height/2);
	},

	add : function( x, y, speed, vec){
		this.list.push([
		    x,
		    y,
		    speed || SCALE.min /50,
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