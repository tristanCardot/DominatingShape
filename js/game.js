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
		if(game.run){
			CTX.globalAlpha = .5;
			CTX.fillStyle = '#000';
			CTX.fillRect(-SIZE, -SIZE, SIZE*2, SIZE*2);

			CTX.fillStyle = '#FFF';
			CTX.fillRect(-20, -25, 15, 50);
			CTX.fillRect(5, -25, 15, 50);

			CTX.globalAlpha = 1;
		}
		
		
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
	
	setAudioChan : function(audio){
		this.audioChan = audio;
		this.audioChan.loop = true;
		this.audioChan.volume = .5;
	}
};

var count = 5;