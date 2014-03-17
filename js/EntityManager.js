/**@constructor*/
function EntityManager(){
	this.list = [];
	this.particles = [];
	this.lastOffset = 0;
	
	this.audioChan = null;
	
	this.lastPatternIndex = 0;
	this.currentPattern = null;
}

EntityManager.prototype = {
	/**Rénisialise la liste des entités et la vitesse celon la difficultée.*/
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
	
	/**Génération aléatoire d'entités.
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
	},*/
	
	/**Ajoute l'entité entity.
	 * @param {Entity} entity 
	 */
	pushEntity : function( entity){
		this.list.push( entity);
		
		if(this.list.length === 1)
			player.morphing( this.list[0]);
	},
	
	/**Met à jour le parterne courant.
	 * @param {Number} delta
	 */
	updatePattern : function(delta){
		var result = this.currentPattern.update(delta);
		
		if(result !== 1){
			switch(game.difficulty){
				case 0: game.speed += 0.01;
					break;
				case 1: game.speed += 0.015;
					break;
				case 2: game.speed += 0.020;
					break;				
			}
			
			var id = Math.floor( Math.random() *PATTERN.length);
			if( this.lastPatternIndex === id)
				id = ( id +2) %PATTERN.length;
			
			this.lastPatternIndex = id;
			this.currentPattern = new Pattern( PATTERN[ id], result);
		}
	},
	
	/**Met à jour la liste des entités.
	 * @param {Number} delta
	 */
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
	
	/**Dessine l'ensembles des entités & particles.*/
	draw : function(){
		for(var i=0; i<this.particles.length; i++)
			this.particles[i].draw();
		
		for(var i=0; i<this.list.length; i++)
			this.list[i].draw();
	},
	
	/**Récupére la prochaine cible du joueur.
	 * @return {Entity} 
	 */
	getTarget : function(){
		var select = ~~( Math.random() *( 4 -game.difficulty) ) -this.lastOffset;

		if( select >= this.list.length )
			select = this.list.length -1;

		else if( select < 0)
			select = 0;

		this.lastOffset = select;

		return this.list[select];
	},

	/**Récupére la disstance le plus courte entre un joueur et une entité.
	 * @return {Number}
	 */
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

	/**Retourne une liste des entités qui rentrent en collision avec le segment [p1-p2].
	 * @param {Object} p1
	 * @param {Object} p2
	 * @return {Array}
	 */
	getCollide : function( p1, p2){
		var result = [];

		for(var s, i=0, c={x:0,y:0}, rx, ry, p12={x:0,y:0}, p1c={x:0,y:0}, p2c={x:0,y:0}; i<this.list.length; i++){
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

	/**Collision avec la droite p1->p2
	 * @return {Boolean}
	 */
	lineCollide : function( p1, p2, c1, s){
		var u = {x: p2.x -p1.x,
		         y: p2.y -p1.y },
		  p1c ={ x: c1.x -p1.x,
	             y: c1.y -p1.y };

	   var num = u.x *p1c.y -u.y *p1c.x;
	   if( num < 0)
		   num = -num;
	   
	   return num /Math.sqrt( u.x *u.x +u.y *u.y) < s.scale;
	},
	
	/**Retire une entité et ajoute les particules qui lui sont liées.
	 * @param {Entity} entity
	 */
	remove : function( entity){
		var particle = new Particle( entity.shape, entity.color, 800),
			x = Math.cos( entity.angle) *entity.range *SCALE.x,
			y = Math.sin( entity.angle) *entity.range *SCALE.y;
		
		var off = ( ( Math.random() *Math.PI) %( Math.PI /6) ) +Math.PI /2;
		
		for(var i=0; i<20; i++)
			particle.add( x, y , 0.004 *SCALE.min *( i +1) +0.05 *SCALE.min, ( i +1) *off);
		
		this.particles.push( particle );
		
		game.audio.fx.play();
		
		this.list.splice( this.list.indexOf(entity), 1);
	},

	resetPattern : function(){
		this.currentPattern = new Pattern( PATTERN[ ~~( Math.random() *PATTERN.length) ], 0);
	}
};



















