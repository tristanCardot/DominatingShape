function EntityManager(){
	this.list = [];
	this.particles = [];
	this.currentLevel = 0;
	this.lastOffset = 0;
	this.audioChan = null;
	this.currentPattern = new Pattern( PATTERN[0]);
}

EntityManager.prototype = {
	reset : function(){
		this.list = [];
		
		switch( game.difficulty){
			case 0: game.speed = 1;
				break;
			case 1: game.speed = 1.25;
				break;
			case 2: game.speed = 1.6;
				break;
		}
	},
	
	spawn : function(){
		var needMorph = this.list.length === 0;
		var rad = ( Math.floor( Math.random() *6) *Math.PI /3 +player.shape.rotation) %PI2;
		
		for(var i=0, end=2 +Math.floor( Math.random() *2); i < end; i++)
		this.list.push( new Entity(
			SIZE *.9,
			rad +i *( PI2 /6),
			1 /90,
			SHAPE[ Math.floor( Math.random() *SHAPE.length) ],
			COLOR[ Math.floor( Math.random() *COLOR.length) ]
		));

		if(needMorph)
			player.morphing( this.list[0]);
	},
	
	pushEntity : function( entity){
		this.list.push( entity);
		
		if(this.list.length === 1)
			player.morphing( this.list[0]);
	},
	
	updatePattern : function(delta){
		var result = this.currentPattern.update(delta);
		
		if(result !== 1){
			switch(game.difficulty){
				case 0: game.speed += 0.01;
					break;
				case 1: game.speed += 0.015;
					break;
				case 2: game.speed += 0.025;
					break;				
			}
			
			this.currentPattern = new Pattern(PATTERN[ Math.floor( Math.random() *PATTERN.length) ], result);
		}
	},

	update : function(delta){
		var i, s;
		
		for(i=0; i<this.particles.length; i++){
			s = this.particles[i];

			s.update(delta);

			if(s.list.length === 0){
				this.particles.splice( i, 1 );
				i--;
			}
		}

		for(i=0; i<this.list.length; i++)
			if( this.list[i].update(delta)){
				while( this.list.length !== 0)
					this.remove( this.list[0]);

				game.audio.music.stop();
				game.openGui( GUI.MENU);
				return;
			}
	},

	draw : function(){
		for(var i=0; i<this.particles.length; i++)
			this.particles[i].draw();
		
		for(var i=0; i<this.list.length; i++)
			this.list[i].draw();
	},

	getTarget : function(){
		var select = ~~( Math.random() *4) -this.lastOffset;

		if( select >= this.list.length )
			select = this.list.length -1;

		else if( select < 0)
			select = 0;

		this.lastOffset = select;

		return this.list[select];
	},
	
	getNearestRange : function(){
		var select = this.list[0];
		for(var i=0; i<this.list.length; i++)
			if(select.range > this.list[i].range)
				select = this.list[i];
			
		if(select)
			return select.range;
		else
			return 100;
	},

	getCollide : function(p1, p2){
		var result = [];

		for(var s,i=0, c={x:0,y:0}, rx, ry, p12={x:0,y:0},p1c={x:0,y:0},p2c={x:0,y:0}; i<this.list.length; i++){
			s = this.list[i];

			c.x = Math.cos( s.angle) *s.range;
			c.y = Math.sin( s.angle) *s.range;

			rx = p1.x -c.x;
			ry = p1.y -c.y;

			if( Math.sqrt( rx *rx +ry *ry) < s.scale *1.2){
				result.push(s);
				continue;
			}

			rx = p2.x -c.x;
			ry = p2.y -c.y;

			if( Math.sqrt( rx *rx +ry *ry) < s.scale *1.2){
				result.push(s);
				continue;
			}

			if( !this.lineCollide( p1, p2, c, s) )
				continue;
			
			p12.x = p2.x -p1.x;
			p12.y = p2.y -p1.y;
			p1c.x = c.x -p1.x;
			p1c.y = c.y -p1.y;
			p2c.x = c.x -p2.x;
			p2c.y = c.y -p2.y;
			
			if( p12.x *p1c.x +p12.y *p1c.y >= 0  &&
			    (-p12.x) *p2c.x +(-p12.y) *p2c.y >= 0 ){
				result.push(s);
			}
		}

		return result;
	},

	lineCollide : function(p1, p2, c1, s){
		var u = {x: p2.x -p1.x,
		         y: p2.y -p1.y },
		  p1c ={ x: c1.x -p1.x,
	             y: c1.y -p1.y };

	   var num = u.x *p1c.y -u.y *p1c.x;
	   if( num < 0)
		   num = -num;
	   
	   return num /Math.sqrt( u.x *u.x +u.y *u.y)  <  s.scale;
	},

	remove : function(entity){
		var particle = new Particle( entity.shape, entity.color, 800 ),
			x = Math.cos( entity.angle ) *entity.range *SCALE.x,
			y = Math.sin( entity.angle ) *entity.range *SCALE.y;
		
		var off = ( ( Math.random() *Math.PI) %( Math.PI /6) ) +Math.PI /2;
		for(var i=0; i<20; i++)
			particle.add( x, y , 0.004 *SCALE.min *( i +1) +0.05 *SCALE.min, ( i +1) *off);
		
		this.particles.push( particle );
		
		game.audio.fx.play();
		
		this.list.splice( this.list.indexOf(entity), 1);
	},

	setAudioChan : function(audio){
		audio.volume = .1;
		this.audioChan = audio;
	}
};



















