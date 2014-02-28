function Cursor(){
	this.press = false;
	
	this.x = 0;
	this.y = 0;
	
	this.bindEvent(this);
}

Cursor.prototype = {
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
	
	down : function(e, node){
		this.press = true;
		this.x = ( e.x -node.offsetWidth /2 ) /SCALE.x;
		this.y = ( e.y -node.offsetHeight /2 ) /SCALE.y;
	},
	
	up : function(e, node){
		this.press = false;
	},
	
	move : function(e, node){
		if(this.press){
			this.x = ( e.x -node.offsetWidth /2 ) /SCALE.x;
			this.y = ( e.y -node.offsetHeight /2 ) /SCALE.y;
		}
	}
		
		
};