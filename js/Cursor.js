/**Représente les inputs du joueur.
 * @constructor
 */
function Cursor(){
	/** @type {Boolean}*/ this.press = false;
	
	/** @type {Number}*/this.x = 0;
	/** @type {Number}*/this.y = 0;
	/** @type {Number}*/this.lastX = 0;
	/**@type {Number}*/this.lastY = 0;
	
	this.bindEvent(this);
}

Cursor.prototype = {
	/**Lie les événements permettant de capturer les interactions du joueur au document. 
	 * @param {Cursor} self 
	 */
	bindEvent: function(self){
		CANVAS.addEventListener('mousedown', function(e){
			self.down(e, this);
		}, false);
		
		CANVAS.addEventListener('mouseup', function(e){
			self.up(e, this);
		}, false);

		CANVAS.addEventListener('mouseout', function(e){
			self.up(e, this);
		}, false);
		
		CANVAS.addEventListener('mousemove', function(e){
			self.move(e, this);
		}, false);
	},
	
	/**Lors de la pression. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	down : function(e, node){
		this.press = true;
		this.lastX = this.x = ( e.x -node.offsetWidth /2 ) /SCALE.x;
		this.lastY = this.y = ( e.y -node.offsetHeight /2 ) /SCALE.y;
		
		this.press = Math.sqrt( this.x *this.x + this.y *this.y ) < 20;
	},
	
	/**Lors du relachement. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	up : function(e, node){
		this.press = false;
		player.updateScore();
	},
	
	/**Lors du mouvement. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	move : function(e, node){
		if(this.press){
			this.lastX = this.x;
			this.lastY = this.y;
			
			this.x = ( e.x -node.offsetWidth /2 ) /SCALE.x;
			this.y = ( e.y -node.offsetHeight /2 ) /SCALE.y;
		}
	}
};