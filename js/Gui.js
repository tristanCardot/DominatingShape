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
	var div = document.createElement('div');
	div.style.color = 'white';
	div.style.position = 'fixed';
	div.style.top = '0px';
	div.innerHTML = 'def';
	div.id = 'log';
	
	document.body.appendChild(div);
	
	am.load('biup', window.location.href +'audio/biup');
	am.load('inspiration',  window.location.href +'audio/Inspiration');
	em.setAudioChan( am.get('biup'));
	game.setAudioChan( am.get('inspiration'));

	am.pushEvent(game.audioChan, 'play');
	

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









