function AudioManager(){
	this.buffer = {};
}

AudioManager.prototype = {
	load : function(name, path, type){
		var node = document.createElement('audio');
		node.type = type;
		node.src = path;

		this.buffer[name] = node;
	},
	
	get : function(name){
		return this.buffer[name];
	}
};