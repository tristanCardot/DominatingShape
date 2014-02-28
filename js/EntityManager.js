function EntityManager(){
	this.list = [];
	this.currentLevel = 0;
	this.lastOffset = 0;
}

EntityManager.prototype = {
	spawn : function(){
		this.list.push( new Entity(
			SIZE,
			Math.floor(Math.random()*6)*Math.PI/3,
			1/26,
			SHAPE[ Math.floor( Math.random() *SHAPE.length) ],
			COLOR[ Math.floor( Math.random() *COLOR.length) ]
		));
	},

	updateAndDraw : function(delta){
		var i;
		for(i=0; i<this.list.length; i++){
			if(this.list[i].update(delta)){
				this.list.splice( i,1 );
				i--;

			}else
				this.list[i].draw();
		}
	},

	getTarget : function(){
		var select = Math.random() *3 -this.lastOffset;
		
		if( select >= this.list.length )
			select = this.list.length -1;
		
		else if(select < 0)
			select = 0;
		
		this.lastOffset = select -2;
		
		return this.list[select];
	},
	
	getCollide : function(x, y){
		var result = [];
		
		for(var s,i=0, rx, ry; i<this.list.length; i++){
			s = this.list[i];
			
			rx = x -( Math.cos(s.angle) *s.range );
			ry = y -( Math.sin(s.angle) *s.range );
			if( Math.sqrt( rx *rx +ry *ry ) )
				result.push(s);
		}

		return result;
	},
	
	remove : function(entity){
		this.list.splice( this.list.indexOf(entity), 1);
	}
};