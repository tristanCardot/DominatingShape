/**@constructor
 * @param {Function} open
 * @param {Function} close
 * @param {Function} update
 * @param {Function} render
 */
function Gui( open, close, update, render){
	this.open = open;
	this.close = close;
	this.update = update;
	this.render = render;
}

window.GUI = {
	NONE : -1,
	LOADER : 0,
	MENU : 1,
	PLAY : 2,
	OPTIONS : 3,
	CREDIT : 4 
};

function buildGui( game){
	return [
		buildGuiLoader( game),
		buildGuiMenu( game),
		buildGuiPlay( game),
		buildGuiOptions( game),
		buildGuiCredit( game)
	];
}

function buildGuiLoader( game){
	var gui = new Gui(
		//open
		function(){
			if( this.firstLoad){
				this.firstLoad = false;
				var l = {
					'mousedown': player.cursor.eventDown,
					'mouseup': player.cursor.eventUp,
					'mouseout': player.cursor.eventUp,
					'touchstart' : player.cursor.eventDown,
					'touchend' : player.cursor.eventUp,
					'touchcancel' : player.cursor.eventUp
				};

				for( key in l )
					window.addEventListener( key, l[key], false);
			}
	
			this.updateTime = 0;
			this.targetProgress = 0;
			this.progress = 0;

			var self = this;

			window.controler = new Controler();
			
			if(this.list == null)
				return;
				
			AM.loadList(
				this.list,
	
				function( e){
					game.setAudioChan('music', AM.channel.music);
					game.setAudioChan('fx', AM.channel.fx);
					
					game.openGui(GUI.MENU);
				},
	
				function( request, e){
					if( e.type === 'load'){
						request.loaded = request.total *1.05;
	
					}else{
						request.loaded = e.loaded;
						request.total = e.total *1.05;
					}
	
					var total=0, loaded=0;
					for(var i=0; i<this.files.length; i++){
						loaded += this.files[i].loaded || 0;
						total += this.files[i].total || 1000000;
					}
					
					self.updateTime = 0;
					self.targetProgress = loaded /total;
				}
			);
		},
		
		//close
		function(){
		},
		
		//update
		function( delta){
			this.updateTime += delta;
			player.shape.rotation += delta/1100;

			player.particle.updateCtx();
			player.particle.update(delta);
			
			if(this.updateTime > 2500)
				this.updateTime = 2500;
		},
		
		//render
		function(){
			player.drawBackground();
			player.drawFromProgress( this.progress *( 2500 -this.updateTime) +this.targetProgress *this.updateTime /2500);
		}
	);
	
	gui.loadList = function(data){
		this.list = {};
		var ex = '.ogg';

		if(document.createElement('audio').canPlayType('audio/ogg') === "")
			ex = '.mp3';
		
		for(key in data)
			this.list[key] = 'audio/'+ data[key] +ex;
	};
	
	gui.firstLoad = true;
	
	gui.loadLink = function(key, url){
		this.list = {};
		this.list[key] = url;
	};
	
	return gui;
}

function buildGuiMenu( game){
	var gui = new Gui(
		//OPEN
		function( from){
			var l = {
					mouseup : this.up,
					mouseout : this.up,
					touchend : this.up,
					touchcancel : this.up
				};
			
			if( from === GUI.LOADER){
				l.mousemove = player.cursor.eventMove;
				l.touchmove = player.cursor.eventMove;
			}
				
			for(key in l)
				window.addEventListener( key, l[key], false);

			controler.reset();
			controler.scale = 20;
			controler.rotationSpeed = 0.001;
			
			em.reset();
			
			var shape = SHAPE[ Math.floor( Math.random() *SHAPE.length) ],
				color = COLOR[ Math.floor( Math.random() *COLOR.length) ];

			em.pushEntity( new Entity( 80, 0, 0, shape, color) );
			em.pushEntity( new Entity( 80, Math.PI, 0, shape, color) );
		},
		//CLOSE
		function( to){
			var l = {
				'mouseup': this.up,
				'mouseout': this.up,
				'touchend' : this.up,
				'touchcancel' : this.up,
			};

			for(key in l)
				window.removeEventListener( key, l[key], false);
		},
		//UPDATE
		function(delta){
			this.tick += delta;
			
			if( this.tick > this.nextLaps){
				this.nextLaps = Math.random() *500 +250;
				this.tick = 0;
				this.color.morphing( COLOR[ ~~(Math.random() *COLOR.length) ] );
			}
			
			this.color.update(delta);
			player.update(delta);
			em.update(delta);

			if( em.list.length < 2){
				if( !em.list[0] || em.list[0].angle !== 0)
					game.openGui( GUI.PLAY);
				else
					game.openGui( GUI.OPTIONS);
			}
		},
		//RENDER
		function(){
			player.drawBackground();
			em.draw();
			player.draw();
			
			CTX.globalAlpha = .8;
			CTX.fillStyle = '#FFF';
			
			
			CTX.translate( 80 *SCALE.x, 0);
			CTX.scale( SCALE.min, SCALE.min);

			CTX.beginPath();
			CTX.moveTo( 15, 0);
			CTX.lineTo( -10.5, -15);
			CTX.lineTo( -10.5, 15);
			CTX.closePath();
			CTX.fill();
			
			CTX.scale( 1 /SCALE.min, 1 /SCALE.min);
			CTX.translate( -160 *SCALE.x, 0);
			CTX.scale( SCALE.min, SCALE.min);
			
			CTX.beginPath();
			
			CTX.arc( 0, 0, 12, 0, Math.PI *2, false);
			
			CTX.rotate(-Math.PI /12);
			
			CTX.moveTo( -6, -16);
			CTX.lineTo( -6, -6);
			
			
			CTX.lineTo( -16, -6);
			CTX.lineTo( -16, 6);

			CTX.lineTo( -6, 6);
			CTX.lineTo( -6, 16);

			CTX.lineTo( 6, 16);
			CTX.lineTo( 6, 6);
			
			CTX.lineTo( 16, 6);
			CTX.lineTo( 16, -6);

			CTX.lineTo( 6, -6);
			CTX.lineTo( 6, -16);

			CTX.lineTo( -6, -16);

			CTX.rotate(Math.PI /12);
			
			CTX.moveTo( 0, 0);

			CTX.arc( 0, 0, 12, 0, Math.PI *2, false);
			CTX.arc( 0, 0, 4, 0, Math.PI *2, true);
			
			CTX.closePath();
			CTX.fill();
			
			CTX.scale( 1 /SCALE.min, 1 /SCALE.min);
			CTX.translate( 80 *SCALE.x, 0);
			

			CTX.globalAlpha = 1;
			CTX.textAlign = 'center';
			CTX.fillStyle = (function(){
				switch( game.difficulty){
					case 1: return '#FF0';
					case 2: return '#F00';
					default: return '#0F0';
				};
			})();
			
			CTX.fillText( 'BEST: '+ game.score[game.difficulty], 0, 85 *SCALE.y, 180 *SCALE.x);
			
			CTX.fillStyle = '#FFF';
			
			if( player.score > 0)
				CTX.fillText( player.score, 0, 8 *SCALE.min, 100 *SCALE.x);

			var font = CTX.font;
			CTX.font = ( ( SCALE.min) *32) +'px Byte';
			
			CTX.fillText( 'SHAPE', -45 *SCALE.min, -75 *SCALE.y, 90 *SCALE.min);
			
			CTX.fillStyle = this.color.evaluate(1.0);
			CTX.fillText( 'COLOR', 45 *SCALE.min, -60 *SCALE.y, 90 *SCALE.min);
			
			CTX.font = font;
			
			CTX.textAlign = 'start';
		}
	);

	gui.tick = 0;
	gui.nextLaps = Math.random() *500 +250;
	gui.color = new ColorP(0);
	
	return gui; 
}

function buildGuiPlay( game){
	var gui = new Gui(
		//OPEN
		function( from){
			var l = {
					'mouseup': this.up,
					'mouseout': this.up,
					'touchend' : this.up,
					'touchcancel' : this.up,
					
					'pagehide' : this.pause,
					'blur' : this.pause
				};

				for( key in l )
					window.addEventListener( key, l[key], false);

				em.reset();
				em.resetPattern();
				controler.reset();
				player.reset();
				
				game.audio.music.stop();
				game.audio.music.play();
		},
		
		//CLOSE
		function( to){
			var l = {
				'mouseup': this.up,
				'mouseout': this.up,
				'touchend' : this.up,
				'touchcancel' : this.up,
				
				'pagehide' : this.pause,
				'blur' : this.pause
			};

			for( key in l )
				window.removeEventListener( key, l[key], false);
			
			game.updateBestScore();
		},
		
		//UPDATE
		function(delta){
			controler.update(delta);
			em.updatePattern(delta);
			
			var range = em.getNearestRange();
			if(range< 40)
				game.audio.music.filterFreq = 22000 *range /60 *range /60;
			else
				game.audio.music.filterFreq = 22000;
			

			player.update( delta);
			em.update( delta);
		},
		
		//RENDER
		function(){
			player.drawBackground();
			em.draw();
			
			player.draw();
			player.drawScore();
			
			controler.draw();
		}
	);
	
	gui.up = function(e){
		player.updateScore();
	};

	gui.resume = function(e){
		window.removeEventListener( 'mouseup', gui.resume, false);
		window.removeEventListener( 'touchend', gui.resume, false);
		
		game.start();
		game.audio.music.play();
	};

	gui.bindResume = function(){
		window.addEventListener( 'mouseup', gui.resume, false);
		window.addEventListener( 'touchend', gui.resume, false);
	};
	
	gui.pause = function(e){
		game.stop();
		gui.bindResume();
	};
	
	return gui;
}

function buildGuiOptions( game){
	var gui = new Gui(
		//OPEN
		function(){
			this.inputs[0].data = game.audio.fx.volume;
			this.inputs[1].data = game.audio.music.volume;
			
			switch(game.difficulty){
				case 1:
						this.inputs[2].color = '#FF0';
						this.inputs[2].data = .66;
					break;
				case 2:
						this.inputs[2].color = '#F00';
						this.inputs[2].data = 1;
					break;
				default :
						this.inputs[2].color = '#0F0';
						this.inputs[2].data = .33;
					break;
			}

			em.reset();
			em.pushEntity( new Entity( 80, Math.PI /2, 0, 
					SHAPE[ Math.floor( Math.random() *SHAPE.length) ],
					COLOR[ Math.floor( Math.random() *COLOR.length) ]) );
		},
		//CLOSE
		function(){
			game.audio.music.stop();
			player.score = 0;
		},
		//UPDATE
		function(delta){;
			player.update(delta);
			em.update(delta);
			
			for(var i=0; i < this.inputs.length; i++)
				this.inputs[i].update();
			
			if(em.list.length === 0)
				game.openGui(GUI.MENU);
		},
		//RENDER
		function(){
			player.drawBackground();
			em.draw();
			player.draw();

			CTX.fillStyle = '#FFF';
			
			for(var i=0; i < this.inputs.length; i++)
				this.inputs[i].render();

			CTX.textAlign = 'center';
			CTX.fillStyle = '#FFF';
			CTX.fillText('BACK', 0, 90 *SCALE.y);
			CTX.textAlign = 'start';
			
		}
	);
	
	 function buttonRender(){
		CTX.globalAlpha = .5;
		CTX.fillRect( this.x *SCALE.min, this.y *SCALE.min, this.width *SCALE.min, this.height *SCALE.min);
		CTX.fillRect( this.x *SCALE.min, this.y *SCALE.min, this.width *this.data *SCALE.min, this.height *SCALE.min);
		
		CTX.globalAlpha = 1;
		CTX.fillText( this.type, ( this.x -20) *SCALE.min, ( this.y +this.height) *SCALE.min, 18 *SCALE.min);
	};
	
	function buttonUpdate(){
		var c = {
			press: player.cursor.press,
			x: player.cursor.x /SCALE.min *SCALE.x,
			y: player.cursor.y /SCALE.min *SCALE.y
		};

		if(	c.press && c.x > this.x && c.x < this.x +this.width && c.y > this.y && c.y < this.y +this.height){
				game.audio[this.name].volume = this.data = ( c.x -this.x) /this.width;
				localStorage.setItem( this.name +'.volume', game.audio[this.name].volume.toString());

				if(game.audio[this.name].state === game.audio[this.name].STOP)
					game.audio[this.name].play();
		}
	};
	
	gui.inputs =[{
		type: 'FX',
		name: 'fx',
		data: 0,
		x: -50,
		y: -60,
		height: 15,
		width: 120,
		update: buttonUpdate,
		render: buttonRender
	},{
		type: 'MSC',
		name: 'music',
		data: 0,
		x: -50,
		y: -30,
		height: 15,
		width: 120,
		update: buttonUpdate,
		render: buttonRender
	},{
		type: 'LVL',
		color: '#0F0',
		data: 0,
		x: -50,
		y: 15,
		height: 15,
		width: 120,
		update: function(){
			var c = {
				press: player.cursor.press,
				x: player.cursor.x /SCALE.min *SCALE.x,
				y: player.cursor.y /SCALE.min *SCALE.y
			};

			if(	c.press && c.x > this.x && c.x < this.x +this.width && c.y > this.y && c.y < this.y +this.height){
				var progress = this.data = ( c.x -this.x) /this.width;
				
				if(progress < .33){
					this.color = '#0F0';
					this.data = .33;
					game.difficulty = 0;
					
				}else if(progress < .66){
					this.color = '#FF0';
					this.data = .66;
					game.difficulty = 1;
					
				}else{
					this.color = '#F00';
					this.data = 1;
					game.difficulty = 2;
				}
				
				localStorage.setItem( 'difficulty', game.difficulty.toString());
			}
		},
		render: function(){
			CTX.globalAlpha = .5;
			CTX.fillStyle = this.color;

			CTX.translate( this.x *SCALE.min, this.y *SCALE.min);
			
			CTX.fillRect( 0, 0, this.width *SCALE.min, this.height *SCALE.min);
			CTX.fillRect( 0, 0, this.width *this.data *SCALE.min, this.height *SCALE.min);
			
			CTX.globalAlpha = 1;
			CTX.fillText( this.type, -20 *SCALE.min, 15 *SCALE.min, 18 *SCALE.min);
			
			CTX.translate( -this.x *SCALE.min, -this.y *SCALE.min);
		}
	}];

	return gui;
}
	
function buildGuiCredit(){
	var gui = new Gui(
		//OPEN
		function(){
			em.reset();
			em.pushEntity( new Entity( 80, Math.PI /2, 0,
					SHAPE[ Math.floor( Math.random() *SHAPE.length) ],
					COLOR[ Math.floor( Math.random() *COLOR.length) ]) );
		},
		//CLOSE
		function(){
		},
		//UPDATE
		function(delta){
		},
		//RENDER
		function(){
		}
	);
	
	
	
	
	
	return gui;
}






