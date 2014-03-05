function AudioManager(){
	this.buffer = {};
	this.events = [];
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
	},
	
	pushEvent : function(node, action){
		this.events.push([node,action]);
	},
	
	execEvents : function(){
		while(this.events.length !== 0){
			s = this.events.splice(0,1)[0];
			s[0][ s[1] ]();
		}
	}
};

HTMLAudioElement.prototype.replay = function(){
	this.play();
};