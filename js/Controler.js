function Controler(){
	this.reset();
	this.data = [];
}

Controler.prototype = {
	reset : function(){
		this.angleSpeed = 0;
		this.rotationSpeed = 0;
		this.scale = 0;
		this.angle = 0;
	},
		
	update : function(delta){
		var d = getAudioData();
		
		this.angleSpeed = this.angleSpeed /2 +( ( ( d[0] %64) +( d[1] %128) -( d[3] %256)) /( 256) ) *.0005;
		this.rotationSpeed = this.rotationSpeed /2 + ( ( ( d[2] %64) +( d[4] %128) -( d[8] %256)) /( 256) ) *.005;
		this.scale = ( ( ( d[5] -this.data[5]) +( d[7] -this.data[7]) +( d[9] -this.data[9]) ) /64);
		
		this.angle += this.rotationSpeed *delta;
		
		this.data = d;
	},

	draw : function(){
		CTX.fillStyle = '#888';
		
		for(var i=0; i<this.data.length; i++)
			CTX.fillRect( -200 +i *5,  200,  5, -this.data[i]/ 256 *200 -5);
	}
};

function getAudioData(){
	var freqByteData = new Uint8Array(AM.channel.inspiration.analyser.frequencyBinCount);
	AM.channel.inspiration.analyser.getByteFrequencyData(freqByteData);
	return freqByteData;
};