var SIZE = 110,
PI2 = Math.PI *2,
SCALE = {x:0, y:0, min:0, z:2};


/**@constructor */
function Game(){
	this.run = false;
	
	this.active = 0;
	this.lastUpdate = 0;
	this.speed = 1; 
	this.rotate = 0;
	
	this.guiList = [];
	
	this.activeGui = undefined;
	this.activeGuiId = GUI.NONE;
	
	this.initWithStat();
}

Game.prototype = {
	initWithStat : function(){
		if( !localStorage){
			window.localStorage = {
				getItem : function( item){
					item += '=';
					var ca = document.cookie.split(';');
					
					for(var i=0; i < ca.length; i++){
						var c = ca[i].trim();
						
						if ( c.indexOf(item) === 0)
							return c.substring( item.length, c.length);
					}
					
					return null;
				},
				
				setItem : function( item, value){
					if(!value || !value.length || value.length > 32)
						return;
					
					var d = new Date();
					d.setTime( d.getTime() +( 30 *24 *60 *60 *1000) );
					var expires = "expires="+d.toGMTString();
					
					document.cookie = cname + "=" + cvalue + "; " + expires;
				}
			};
		}

		this.difficulty = parseInt( localStorage.getItem('difficulty') ) || (function(){
			localStorage.setItem('difficulty', '0');
			return 0;
		})();
		
		this.audio = {};
	},

	onload : function(){
		this.guiList = buildGui(this);

		window.addEventListener('touchstart',
			function(e){e.preventDefault();},
			false);
		
		window.addEventListener('resize',
			function(e){game.resize();},		
			false);
		

		this.guiList[GUI.LOADER].loadList({
			music : 'higeDrive',
			fx : 'biup'
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
		
		this.audio.music.pause();
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
	openGui : function( id){
		if( this.activeGui !== undefined)
			this.activeGui.close( id);
		
		this.activeGui = this.guiList[id];
		
		if( this.activeGui !== undefined){
			this.activeGui.open( this.activeGuiId);
			this.activeGuiId = id;
			
		}else
			this.activeGuiId = GUI.NONE;
	},
	
	setAudioChan : function( name, audio){
		audio.loop = name === 'music';
		audio.volume = 	parseFloat( localStorage.getItem( name +'.volume') ) || ( function(){
			localStorage.setItem( name +'.volume', '.5');
			return .5;
		})();

		this.audio[name] = audio;
	},
	
	resize : function(){
		CTX.translate( -CANVAS.width /2, -CANVAS.height /2);

		SCALE.x = window.innerWidth /( SIZE *2 *SCALE.z);
		SCALE.y = window.innerHeight /( SIZE *2 *SCALE.z);
		SCALE.min = ( SCALE.x < SCALE.y ? SCALE.x : SCALE.y) *1.2;
		
		CANVAS.height = window.innerHeight/SCALE.z;
		CANVAS.width = window.innerWidth/SCALE.z;

		CTX.translate( CANVAS.width /2, CANVAS.height /2);
		
		player.particle.updateScale();
		
		CTX.font = ( ( SCALE.min) *16) +'px Byte';
		CTX.lineWidth = .2;
		
		if(!this.run){
			this.activeGui.render();
			this.drawPause();
		}
	},
	
	drawPause : function(){
		CTX.globalAlpha = .5;
		CTX.fillStyle = '#000';
		CTX.fillRect( -SIZE, -SIZE, SIZE *2, SIZE *2);

		CTX.fillStyle = '#FFF';
		CTX.fillRect( -20, -25, 15, 50);
		CTX.fillRect( 5, -25, 15, 50);

		CTX.globalAlpha = 1;
	}
};







