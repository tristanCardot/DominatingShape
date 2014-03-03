function Gui(event, update, render){
	this.event = event;
	this.update = update;
	this.render = render;
}

Gui.prototype = {
	bindEvent : function(){
		for(key in this.event)
			window.addEventListener(key, this.event[key], false);
	},

	removeEvent : function(){
		for(key in this.event)
			window.removeEventListener(key, this.event[key], false);
	}
};

/**
 * @param {Game} game
 */
function buildGui(game){
	game.guiList.push(new Gui({
			'mousedown': player.cursor.eventDown,
			'mouseup': player.cursor.eventUp,
			'mouseout': player.cursor.eventUp,
			'mousemove': player.cursor.eventMove
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