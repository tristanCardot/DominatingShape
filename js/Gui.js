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
	game.guiList.push(new Gui({
		'mousedown': player.cursor.eventDown,
		'mouseup': player.cursor.eventUp,
		'mouseout': player.cursor.eventUp,
		'mousemove': player.cursor.eventMove
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
			'mousemove': player.cursor.eventMove
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











