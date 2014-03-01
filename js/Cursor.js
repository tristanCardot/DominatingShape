/**Représente les inputs du joueur.
 * @constructor
 */
function Cursor(){
	/** @type {Boolean}*/ this.press = false;
	
	/** @type {Number}*/this.x = 0;
	/** @type {Number}*/this.y = 0;
	
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
		this.x = ( e.x -node.offsetWidth /2 ) /SCALE.x;
		this.y = ( e.y -node.offsetHeight /2 ) /SCALE.y;
	},
	
	/**Lors du relachement. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	up : function(e, node){
		this.press = false;
	},
	
	/**Lors du mouvement. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	move : function(e, node){
		if(this.press){
			this.x = ( e.x -node.offsetWidth /2 ) /SCALE.x;
			this.y = ( e.y -node.offsetHeight /2 ) /SCALE.y;
		}
	}
};