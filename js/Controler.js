function Controler(){
	this.reset();
	this.data = [];
}

Controler.prototype = {
	reset : function(){
		this.angleSpeed = 0;
		this.rotationSpeed = 0;
		this.scale = 10;
		this.angle = 0;
	},
		
	update : function(delta){
		var d = getAudioData();
		
		this.angleSpeed = this.angleSpeed /2 +( ( ( d[1] %64) +( d[4] %128) -( d[8] %256) ) /( 256) ) *.0005 *game.speed;
		this.rotationSpeed = this.rotationSpeed /2 + ( ( ( d[2] %64) +( d[4] %128) -( d[6] %256)) /( 256) ) *.005 *game.speed;
		this.scale = 10 +( ( Math.abs( d[3] -this.data[3]) +Math.abs( d[5] -this.data[5]) +Math.abs( d[7] -this.data[7]) ) /64);
		
		this.angle += this.angleSpeed *delta;
		this.data = d;
	},

	draw : function(){
		CTX.fillStyle = '#888';
		CTX.globalAlpha = .2;
		
		for(var i=0; i<this.data.length; i++)
			CTX.fillRect( -110 *SCALE.x +i *2 *SCALE.x,  110 *SCALE.y,  SCALE.x *2, ( -this.data[i] /2.56 -5) *SCALE.y);
		
		CTX.globalAlpha = 1;
	}
};

