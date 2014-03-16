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
	OPTIONS : 3
};

function buildGui( game){
	return [
		buildGuiLoader( game),
		buildGuiMenu( game),
		buildGuiPlay( game),
		buildGuiOptions( game)
	];
}

function buildGuiLoader( game){
	var gui = new Gui(
		//open
		function(){
	
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
					mousedown : player.cursor.eventDown,
					mouseup : this.up,
					mouseout : this.up,
					touchstart : player.cursor.eventDown,
					touchend : this.up,
					touchcancel : this.up
				};
			
			if( from === GUI.LOADER){
				l.mousemove = player.cursor.eventMove;
				l.touchmove = player.cursor.eventMove;
			}
				
			for(key in l)
				window.addEventListener( key, l[key], false);

			em.reset();
		},
		//CLOSE
		function( to){
			var l = {
				'mousedown': this.down,
				'mouseup': this.up,
				'mouseout': this.up,
				'touchstart' : this.down,
				'touchend' : this.up,
				'touchcancel' : this.up,
			};

			for(key in l)
				window.removeEventListener( key, l[key], false);
		},
		//UPDATE
		function(delta){
			player.update(delta);
			em.update(delta);

			if(em.list.length === 0 && game.audio.music.state === game.audio.music.PLAY)
				game.openGui(GUI.PLAY);
		},
		//RENDER
		function(){
			player.drawBackground();
			em.draw();
			player.draw();
			drawArrow();
		}
	);
	
	gui.up = function(e){
		player.cursor.up( e, this);

		if(em.list.length === 0)
			game.audio.music.play();
	};
	return gui; 
}

function buildGuiPlay( game){
	var gui = new Gui(
		//OPEN
		function( from){
			var l = {
					'mousedown': player.cursor.eventDown,
					'mouseup': this.up,
					'mouseout': this.up,
					'touchstart' : player.cursor.eventDown,
					'touchend' : this.up,
					'touchcancel' : this.up,
					
					'pagehide' : this.pause,
					'blur' : this.pause
				};

				for( key in l )
					window.addEventListener( key, l[key], false);
		},
		
		//CLOSE
		function( to){
			var l = {
				'mousedown': player.cursor.eventDown,
				'mouseup': this.up,
				'mouseout': this.up,
				'touchstart' : player.cursor.eventDown,
				'touchend' : this.up,
				'touchcancel' : this.up,
				
				'pagehide' : this.pause,
				'blur' : this.pause
			};

			for( key in l )
				window.removeEventListener( key, l[key], false);
			
			controler.reset();
		},
		
		//UPDATE
		function(delta){
			controler.update(delta);
			em.updatePattern(delta);

			player.update( delta);
			em.update( delta);
		},
		
		//RENDER
		function(){
			player.drawBackground();
			em.draw();
			player.draw();
			controler.draw();
		}
	);
	
	gui.up = function(e){
		player.cursor.up(e, this);
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
			this.input[0].data = game.audio.music.volume;
			this.input[1].data = game.audio.fx.volume;
		},
		//CLOSE
		function(){
		},
		//UPDATE
		function(delta){;
			player.update(delta);
			
			for(var i=0; i < this.input.length; i++)
				this.input[i].update();
		},
		//RENDER
		function(){
			player.drawBackground();
			player.draw();
			
			CTX.globalAlpha = .25;
			CTX.fillStyle = '#FFF';
			
			for(var i=0; i < this.input.length; i++)
				this.input[i].render();
			
			CTX.globalAlpha = 1;
		}
	);
	
	 function buttonRender(){
		CTX.translate( this.x *SCALE.min, this.y *SCALE.min);
		CTX.fillRect( 0, 0, this.width *SCALE.min, this.height *SCALE.min);
		CTX.fillRect( 0, 0, this.width *this.data *SCALE.min, this.height *SCALE.min);
		CTX.fillText( this.type, -20 *SCALE.min, 15 *SCALE.min, 18 *SCALE.min);
		
		CTX.translate( -this.x *SCALE.min, -this.y *SCALE.min);
	};
	
	gui.input =[{
		type: 'Fx',
		data: 0,
		x: -60,
		y: -60,
		height: 15,
		width: 120,
		update: function(){
		},
		render: buttonRender
	},{
		type: 'Msc',
		data: 0,
		x: -60,
		y: -30,
		height: 15,
		width: 120,
		update: function(){
			
		},
		render: buttonRender
	},{
		type: 'LvL',
		data: 0,
		x: -60,
		y: 30,
		height: 15,
		width: 120,
		update: function(){
			
		},
		render: buttonRender
	}];

	return gui;
}


function drawArrow(){
	CTX.globalAlpha = .6;
	CTX.fillStyle = '#FFF';
	
	CTX.scale(SCALE.x, SCALE.x);
	
	CTX.moveTo(75, 0);

	CTX.lineTo(65, -10);
	CTX.lineTo(65, -5);
	CTX.lineTo(15, -3);
	CTX.lineTo(15, 3);
	CTX.lineTo(65, 5);
	CTX.lineTo(65, 10);
	
	CTX.scale(1/SCALE.x, 1/SCALE.x);
	
	CTX.fill();
}
	








