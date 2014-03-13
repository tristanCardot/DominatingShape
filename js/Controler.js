function Controler(){
	this.rotationSpeed = 0;
	this.speed = 0.01;
	
	this.data = [];
}

Controler.prototype = {
	update : function(delta){
		var d = this.data = getAudioData();

		this.rotationSpeed = ( ( ( d[0] %64) +( d[1] %128) -( d[3] %256)) /( 256) ) *.05;
		this.speed = ( ( ( d[5] %64) +( d[9] %64) +( d[15] %64) ) /( 64 *3) ) *.05;
		
	},

	draw : function(){
		CTX.fillStyle = '#888';
		
		var save = CTX.globalAlpha;
		CTX.globalAlpha = .25;
		
		for(var i=0; i<this.data.length; i++){
			CTX.fillRect( -200 +i *5,  200,  5, -this.data[i]/ 256 *200 -5);
		}
		
		CTX.globalAlpha = .25;
		CTX.globalAlpha = save;
	},
	
	updateEntities : function( entities){
		for(var i=0; i<entities.length; i++){
			entities[i].angle += this.rotationSpeed;
			entities[i].speed = this.speed;
		}
		
	}
};

function getAudioData(){
	var freqByteData = new Uint8Array(AM.channel.inspiration.analyser.frequencyBinCount);
	AM.channel.inspiration.analyser.getByteFrequencyData(freqByteData);
	return freqByteData;
};