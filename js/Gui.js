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
		if(this.loaded === true)
			return;

		this.updateTime = 0;
		this.targetProgress = 0;
		this.progress = 0;

		var self = this;
		var list;
		
		window.controler = new Controler();

		
		var l = {
			touchstart : function(e){e.preventDefault();}
		};
		
		for(key in l)
			window.addEventListener( key, l[key], false);

		if(document.createElement('audio').canPlayType('audio/ogg') !== "")
			list = {
				'inspiration' : 'audio/B-3.mp3',
				'biup' : 'audio/biup.ogg'
			};
		else
			list = {
				'inspiration' : 'audio/Inspiration.mp3',
				'biup' : 'audio/biup.mp3'
			};
		
		AM.loadList(
			list,

			function( e){
				self.loaded = true;

				game.setAudioChan( AM.channel.inspiration);
				em.setAudioChan( AM.channel.biup);
				
				game.openGui(GUI.MENU);
			},

			function( request, e, end){
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
	});
	
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

			if(em.list.length === 0 && game.audioChan.state === game.audioChan.PLAY)
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
			game.audioChan.play();
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
		},
		
		//UPDATE
		function(delta){
			
			controler.update();
			if( count <= 0 ){
				count = 200 +Math.floor( Math.random() *20);
				em.spawn();

			}else
				count--;

			player.update( delta);
			controler.updateEntities( em.list);
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
		game.audioChan.play();
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
	return new Gui(
			//OPEN
			function(){
			},
			//CLOSE
			function(){
			},
			//UPDATE
			function(){
			},
			//RENDER
			function(){
			}
		);
}



function drawArrow(){
	CTX.globalAlpha = .6;
	CTX.fillStyle = '#FFF';
	CTX.moveTo(130, 0);

	CTX.lineTo(110, -20);
	CTX.lineTo(110, -10);
	CTX.lineTo(30, -8);
	CTX.lineTo(30, 8);
	CTX.lineTo(110, 10);
	CTX.lineTo(110, 20);
	
	CTX.fill();
}
	








