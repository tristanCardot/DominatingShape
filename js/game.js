/**@constructor */
function Game(){
	this.run = false;
	
	this.active = 0;
	this.lastUpdate = 0;
	
	this.guiList = [];
	
	this.activeGui = undefined;
}

Game.prototype = {
	/**Mais en route. */
	start : function(){
		if(this.run)
			return;

		this.run = true;
		this.lastUpdate = Date.now();
		
		this.audioChan.play();
		
		this.update(this);
	},
		
	/**Mais en pause. */
	stop : function(){
		this.run = false;
		this.audioChan.pause();
	},
	
	/**Mais à jour la gui courante. 
	 * @param {Game} self 
	 */
	update : function(self){
		if(!this.run)
			return;
		
		if(this.activeGui === undefined)
			return this.stop();
			
		var delta = Date.now() - this.lastUpdate;
		this.lastUpdate = Date.now();
		
		this.activeGui.update(delta);
		this.activeGui.render();

		requestAnimationFrame( function(){ self.update(self); } );
	},
	
	/**Ouvre le gui [id].
	 * @param {Number} id
	 */
	openGui : function(id){
		if(this.activeGui !== undefined)
			this.activeGui.removeEvent();
		
		this.activeGui = this.guiList[id];
		
		if(this.activeGui !== undefined){
			this.activeGui.init();
			this.activeGui.bindEvent();
		}
	},
	
	setAudioChan : function(audio){console.log(audio);
		this.audioChan = audio;
		this.audioChan.loop = true;
		this.audioChan.volume = .8;
	}
};

var count = 5;