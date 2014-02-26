function EntityManager(){
	this.list = [];
	this.currentLevel = 0;
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
	}
};