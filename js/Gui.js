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
	var div = document.createElement( 'div');
	div.style.color = 'white';
	div.style.position = 'fixed';
	div.style.top = '0px';
	div.innerHTML = 'def';
	div.id = 'log';

	
	return [ 
		buildGuiLoader( game),
		buildGuiMenu( game),
		buildGuiPlay( game),
		buildGuiOptions( game)
	];
	
	/*game.guiList.push(new Gui({
			'mousedown': function(e){
				if(!game.activeGui.played){
					game.activeGui.played = true;
					em.audioChan.play();
					setTimeout(function(){game.audioChan.play();}, 1000);
				}
				player.cursor.down(e,this);
			},
			'mouseup': player.cursor.eventUp,
			'mouseout': player.cursor.eventUp,
			'mousemove': player.cursor.eventMove,
	
			'touchstart' : function(e){
				if(!game.activeGui.played){
					game.activeGui.played = true;
					em.audioChan.play();
					setTimeout(function(){game.audioChan.play();}, 1000);
				}
				player.cursor.touchDown(e,this);
			},
			'touchend' : player.cursor.eventTouchUp,
			'touchcancel' : player.cursor.eventTouchUp,
			'touchmove' : player.cursor.eventTouchMove
		},

		function(){
			this.played = false;
			em.reset();
		},

		function(delta){
			player.update(delta);
			em.update(delta);
			
			if(em.list.length === 0){
				game.openGui(1);
			}
		},

		function(){
			player.drawBackground();
			em.draw();
			player.draw();
			drawArrow();
		}
	));

	game.guiList.push(new Gui({
			'mousedown': player.cursor.eventDown,
			'mouseup': player.cursor.eventUp,
			'mouseout': player.cursor.eventUp,
			'mousemove': player.cursor.eventMove,

			'touchstart' : player.cursor.eventTouchDown,
			'touchend' : player.cursor.eventTouchUp,
			'touchcancel' : player.cursor.eventTouchUp,
			'touchmove' : player.cursor.eventTouchMove
		},

		function(){
			player.score = 0;
			game.audioChan.play();
		},

		function(delta){
			if( count <= 0 ){
				count = 100;
				em.spawn();

			}else
				count--;
			
			player.update(delta);
			em.update(delta);
		},

		function(){
			player.drawBackground();
			em.draw();
			player.draw();
		}
	));

	game.openGui(0);*/
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
		if(document.createElement('audio').canPlayType('audio/mp3') !== "")
			list = {
				'inspiration' : 'audio/Inspiration.mp3',
				'biup' : 'audio/biup.mp3'
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
				game.openGui(GUI.MENU);
			},

			function( request, e, end){
				if( e.type === 'load'){
					request.loaded = request.total *1.2;

				}else{
					request.loaded = e.loaded;
					request.total = e.total *1.2;
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
		
		if(this.updateTime > 2500)
			this.updateTime = 2500;
		
		console.log(this.progress *( 2500 -this.updateTime) +this.targetProgress *this.updateTime /2500);
	},
	
	//render
	function(){
		player.drawFromProgress( this.progress *( 2500 -this.updateTime) +this.targetProgress *this.updateTime /2500);
	});
	
	return gui;
}

function buildGuiMenu( game){
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

function buildGuiPlay( game){
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
	








