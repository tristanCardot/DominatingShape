var SIZE = 100,
PI2 = Math.PI *2,
SCALE = {x:0, y:0, min:0, z:2};


/**@constructor */
function Game(){
	this.run = false;
	
	this.active = 0;
	this.lastUpdate = 0;
	this.difficulty = 0;
	
	this.guiList = [];
	
	this.activeGui = undefined;
	this.activeGuiId = GUI.NONE;
}

Game.prototype = {
	onload : function(){
		this.guiList = buildGui(this);

		window.addEventListener('touchstart',
			function(e){e.preventDefault();},
			false);
		
		window.addEventListener('resize',
			function(e){game.resize();},		
			false);
		

		this.guiList[GUI.LOADER].loadList({
			inspiration : 'Inspiration',
			biup : 'biup'
		});
		
		this.openGui(GUI.LOADER);
		
		CANVAS.height = 0;
		CANVAS.width = 0;
		
		this.resize();
		this.start();
	},

	/**Mais en route. */
	start : function(){
		if(this.run)
			return;

		this.run = true;
		this.lastUpdate = Date.now();

		this.update(this);
	},
		
	/**Mais en pause. */
	stop : function(){
		if(this.run)
			this.drawPause();
		
		this.audioChan.pause();
		this.run = false;
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
			this.activeGui.close(id);
		
		this.activeGui = this.guiList[id];
		
		if(this.activeGui !== undefined){
			this.activeGui.open(this.activeGuiId);
			this.activeGuiId = id;
			
		}else
			this.activeGuiId = GUI.NONE;
	},
	
	setAudioChan : function(audio){
		audio.loop = true;
		audio.volume = .2;
		
		this.audioChan = audio;
	},
	
	resize : function(){
		CTX.translate(-CANVAS.width/2, -CANVAS.height/2);

		SCALE.x = window.innerWidth /( SIZE *2 *SCALE.z);
		SCALE.y = window.innerHeight /( SIZE *2 *SCALE.z);
		SCALE.min = ( SCALE.x < SCALE.y ? SCALE.x : SCALE.y) *1.2;
		
		CANVAS.height = window.innerHeight/SCALE.z;
		CANVAS.width = window.innerWidth/SCALE.z;

		CTX.translate(CANVAS.width/2, CANVAS.height/2);
		
		player.particle.updateScale();
		
		CTX.font = ( SCALE.min *20) +'px sans-serif';
		CTX.lineWidth = .2;
		
		if(!this.run){
			this.activeGui.render();
			this.drawPause();
		}
	},
	
	drawPause : function(){
		CTX.globalAlpha = .5;
		CTX.fillStyle = '#000';
		CTX.fillRect(-SIZE, -SIZE, SIZE*2, SIZE*2);

		CTX.fillStyle = '#FFF';
		CTX.fillRect(-20, -25, 15, 50);
		CTX.fillRect(5, -25, 15, 50);

		CTX.globalAlpha = 1;
	}
};

var count = 5;

function log(txt){
	document.getElementById('log').innerHTML += txt+'|';
}








