/**Représente les inputs du joueur.
 * @constructor
 */
function Cursor(){
	/** @type {Boolean}*/ this.press = false;
	
	/** @type {Number}*/this.x = 0;
	/** @type {Number}*/this.y = 0;
	/** @type {Number}*/this.lastX = 0;
	/**@type {Number}*/this.lastY = 0;
	
	var self = this;
	this.eventDown = function(e){ self.down(e, this); };
	this.eventUp = function(e){ self.up(e, this); };
	this.eventMove = function(e){console.log(e); self.move(e, this); };
}

Cursor.prototype = {
	/**Lors de la pression. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	down : function(e, node){
		this.press = true;
		this.lastX = this.x = ( e.x -node.innerWidth /2 ) /SCALE.x;
		this.lastY = this.y = ( e.y -node.innerHeight /2 ) /SCALE.y;
		
		console.log(node);
		
		
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
			this.x = ( e.x -node.innerWidth /2 ) /SCALE.x;
			this.y = ( e.y -node.innerHeight /2 ) /SCALE.y;
		}
	},
	
	getSegment : function(){
		var result = {
			from : {x: this.lastX , y: this.lastY},
			to	 : {x: this.x, y: this.y}
		};
		
		this.lastX = this.x;
		this.lastY = this.y;
		
		return result;
	}
};