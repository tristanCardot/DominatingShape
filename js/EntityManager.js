function EntityManager(){
	this.list = [];
	this.currentLevel = 0;
}

EntityManager.prototype = {
	spawn : function(){
		var x, y, vec;
		
		var speed = 24000;
		
		switch(Math.floor(Math.random()*4)){
			case 0: x = -CANVAS.width /2;
					y = -CANVAS.height /2;
					vec = {x: CANVAS.width/speed, y: CANVAS.height/speed};
				break;
			case 1: x =  CANVAS.width /2;
					y = -CANVAS.height /2;
					vec = {x: -CANVAS.width/speed, y: CANVAS.height/speed};
				break;
			case 2: x =  CANVAS.width /2;
					y =  CANVAS.height /2;
					vec = {x: -CANVAS.width/speed, y: -CANVAS.height/speed};
				break;
			case 3: x = -CANVAS.width /2;
					y =  CANVAS.height /2;
					vec = {x: CANVAS.width/speed, y: -CANVAS.height/speed};
				break;
		}
		
		this.list.push( new Entity(
			x,  y,  vec,
			SHAPE[ Math.floor( Math.random() *SHAPE.length) ],
			COLOR[ Math.floor( Math.random() *COLOR.length) ]
		));
	},
	
	updateAndDraw : function(delta){
		var i;
		for(i=0; i<this.list.length; i++){
			this.list[i].update(delta);
			this.list[i].draw();
		}
	}
};