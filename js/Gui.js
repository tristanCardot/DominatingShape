/**@constructor
 * @param {Object} event
 * @param {Function} init
 * @param {Function} update
 * @param {Function} render
 */
function Gui(event, init, update, render){
	this.event = event;
	this.init = init;
	this.update = update;
	this.render = render;
}

Gui.prototype = {
	/**Lie les événements lié à la gui. */
	bindEvent : function(){
		for(key in this.event)
			window.addEventListener(key, this.event[key], false);
	},

	/**Retire les événements lié à la gui. */
	removeEvent : function(){
		for(key in this.event)
			window.removeEventListener(key, this.event[key], false);
	}
};

/**Construit les différentes gui.
 * @param {Game} game
 */
function buildGui(game){
	am.load('biup', 'audio/biup.mp3', 'audio/mp3');
	am.load('inspiration', 'audio/inspiration.mp3', 'audio/mp3');
	em.setAudioChan( am.get('biup'));
	game.setAudioChan( am.get('inspiration'));
	
	game.guiList.push(new Gui({
		},
		
		function(){
			player.morphing(new Entity(
				0,
				0,
				0,
				SHAPE[ SHAPE.TRIANGLE ],
				COLOR[ Math.floor( Math.random() *COLOR.length) ]
			));
			
			this.progress = 0;
		},
		
		function(delta){
			player.update(delta);
			this.progress += delta /10000;

			if(this.progress > 1)
				game.openGui(1);
		},
		
		function(){
			player.drawBackground();
			player.drawFromProgress(this.progress);
		}
	));
	
	game.guiList.push(new Gui({
			'mousedown': player.cursor.eventDown,
			'mouseup': player.cursor.eventUp,
			'mouseout': player.cursor.eventUp,
			'mousemove': player.cursor.eventMove,
	
			'touchstart' : player.cursor.eventTouchDown,
			'touchsend' : player.cursor.eventTouchUp,
			'touchcancel' : player.cursor.eventTouchUp,
			'touchmove' : player.cursor.eventTouchMove
		},
	
		function(){
			em.reset();
		},
		
		function(delta){
			player.update(delta);
			em.update(delta);
			
			if(em.list.length === 0){
				game.openGui(2);
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
			'touchsend' : player.cursor.eventTouchUp,
			'touchcancel' : player.cursor.eventTouchUp,
			'touchmove' : player.cursor.eventTouchMove
		},

		function(){
			player.score = 0;
		},
		
		function(delta){
			if( count <= 0 ){
				count = 50;
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

	game.openGui(0);
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











