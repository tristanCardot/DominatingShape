function AudioManager(){
	this.buffer = {};
}

AudioManager.prototype = {
	load : function(name, path){
		var node = document.createElement('audio');
		node.innerHTML = ''+
			"<source src='"+ path +".mp3' type='audio/mpeg'>"+
			"<source src='"+ path +".ogg' type='audio/ogg'>";

		node.preload = 'auto';
		
		this.buffer[name] = node;
	},
	
	get : function(name){
		return this.buffer[name];
	}
};

HTMLAudioElement.prototype.replay = function(){
	this.pause();
	this.currentTime = 0.0;	
	this.play();
};