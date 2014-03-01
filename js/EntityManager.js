function EntityManager(){
	this.list = [];
	this.particles = [];
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
		
		if(this.list.length === 1)
			player.morphing(this.list[0]);
	},

	updateAndDraw : function(delta){
		var i, s;
		
		for(i=0; i<this.particles.length; i++){
			s = this.particles[i];
			
			s.update(delta);
			
			if(s.list.length === 0){
				this.particles.splice( i, 1 );
				i--;
				
			}else
				s.draw();
		}
		
		
		for(i=0; i<this.list.length; i++){
			if(this.list[i].update(delta)){
				this.list.splice( i,1 );
				i--;

			}else
				this.list[i].draw();
		}
	},

	getTarget : function(){
		var select = ~~(Math.random() *3) -this.lastOffset;
		
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
			if( Math.sqrt( rx *rx +ry *ry ) < 18)
				result.push(s);
		}

		return result;
	},
	
	remove : function(entity){
		var particle = new Particle( entity.shape, entity.color, 800 ),
			x = Math.cos( entity.angle ) *entity.range,
			y = Math.sin( entity.angle ) *entity.range;
		
		for(var i=0; i<20; i++)
			particle.add( x, y , 0.008*i+0.14 );
		
		this.particles.push( particle );
		
		this.list.splice( this.list.indexOf(entity), 1);
	}
};