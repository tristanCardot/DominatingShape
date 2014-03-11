function Controler(){
	this.rotationSpeed = 0;
	this.speed = 1;
}

Controler.prototype = {
	update : function(delta){
		var data = getAudioData();
	}
	
};

function getAudioData(){
	var freqByteData = new Uint8Array(AM.channel.inspiration.analyser.frequencyBinCount);
	AM.channel.inspiration.analyser.getByteFrequencyData(freqByteData);
	return freqByteData;
	
};