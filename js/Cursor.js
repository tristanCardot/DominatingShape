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

	this.eventTouchDown = function(e){ self.touchDown(e, this); };
	this.eventTouchUp = function(e){ self.touchUp(e, this); };
	this.eventTouchMove = function(e){ self.touchMove(e, this); };
	this.touchId = null;
}

Cursor.prototype = {
	/**Lors de la pression. 
	 * @param {Event} e 
	 * @param {HTMLCanvasElement} node
	 */
	down : function(e, node){
		this.lastX = this.x = ( e.clientX -node.innerWidth /2 ) /SCALE.x;
		this.lastY = this.y = ( e.clientY -node.innerHeight /2 ) /SCALE.y;

		this.press = Math.sqrt( this.x *this.x + this.y *this.y ) < 35;
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
			this.x = ( e.clientX -node.innerWidth /2 ) /SCALE.x;
			this.y = ( e.clientY -node.innerHeight /2 ) /SCALE.y;
		}
	},
	
	touchDown : function(e, node){
		e.preventDefault();
		
		if(this.press)
			return;
		
		var select = e.touches[ e.touches.length -1 ];
		this.touchId = select.identifier;
		
		this.down( select , node);
	},
	
	touchMove : function(e, node){
		e.preventDefault();
		
		var select = e.touches.item(0);
		
		this.move(select,  node);
	},
	
	touchUp : function(e, node){
		e.preventDefault();
		var select = e.touches.item(0);
		
		document.getElementById('log').innerHTML = select;
		
		this.up(select,  node);
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