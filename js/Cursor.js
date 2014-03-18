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
	this.eventMove = function(e){ self.move(e, this); };
	this.touchId = null;
}

Cursor.prototype = {
	/**Lors de la pression. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	down : function(e, node){
		if(e.clientX === undefined){
			if(this.press)
				return;
			
			e = e.touches.item(0);
		}
		
		this.lastX = this.x = ( e.clientX -node.innerWidth /2 ) /SCALE.x /SCALE.z;
		this.lastY = this.y = ( e.clientY -node.innerHeight /2 ) /SCALE.y /SCALE.z;

		this.press = true;
	},
	
	/**Lors du relachement.
	 * @param {Event} e
	 * @param {HTMLCanvasElement} node
	 */
	up : function(e, node){
		if(e.clientX === undefined){
			e = e.touches.item(0);
		}
			
		this.press = false;
	},
	
	/**Lors du mouvement.
	 * @param {Event} e
	 * @param {HTMLCanvasElement} node
	 */
	move : function(e, node){
		if(e.clientX === undefined){
			e = e.touches.item(0);
		}
		
		if(this.press){
			this.x = ( e.clientX -node.innerWidth /2 ) /SCALE.x /SCALE.z;
			this.y = ( e.clientY -node.innerHeight /2 ) /SCALE.y /SCALE.z;
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