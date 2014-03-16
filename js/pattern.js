function Pattern(data, offset){
	this.data = data;
	
	this.generate = this.getGenerate(data[0]);
	this.currentIndex = 1;
	this.delay = data[1][0] +(offset || 0);
}

Pattern.prototype = {
	update : function( delta){
		this.delay -= delta;
		
		while(this.delay < 0){
			var data = this.data[ this.currentIndex++];
			this.spawn(data);
			
			if(this.currentIndex >= this.data.length)
				return this.delay;
			
			this.delay += this.data[ this.currentIndex][0] /game.speed;
		}
		
		return 1;
	},
	
	getGenerate : function(count){
		var  result = [];
		
		for(var i=0, rand; i<count; i++){
			rand = Math.floor(Math.random()*32);
			result.push( [ SHAPE[ rand >>4], COLOR[ ( rand &3) +( ( rand >>3) &1) ] ]);
		}
		
		return result;
	},
	
	spawn : function( i){
		var p = this.generate[ i[1] ];
		
		var entity = new Entity( 100, i[2] +controler.angle,  i[3] /150 *game.speed, p[0], p[1]);
		entity.time -= this.delay;
		
		em.pushEntity( entity);
	}
};

var RAD =[
		Math.PI /8 *0,
		Math.PI /8 *1,
		Math.PI /8 *2,
		Math.PI /8 *3,
		Math.PI /8 *4,
		Math.PI /8 *5,
		Math.PI /8 *6,
		Math.PI /8 *7,
		Math.PI /8 *8,
		Math.PI /8 *9,
		Math.PI /8 *10,
		Math.PI /8 *11,
		Math.PI /8 *12,
		Math.PI /8 *13,
		Math.PI /8 *14,
		Math.PI /8 *15
	];

	/*delay(ms) / parterneId / angle(rad) / speed(coef)*/
PATTERN = [
       	[ 6,//sphere
  		[2500, 0, RAD[0], 1],
  		[500, 0, RAD[1], 1],
  		[500, 1, RAD[2], 1],
  		[500, 1, RAD[3], 1],
  		
  		[2500, 2, RAD[5], 1.4],
  		[500, 2, RAD[6], 1.4],
  		[500, 3, RAD[7], 1.4],
  		[500, 3, RAD[8], 1.4],
  		
  		[2500, 4, RAD[10], 1.8],
  		[500, 4, RAD[11], 1.8],
  		[500, 5, RAD[12], 1.8],
  		[500, 5, RAD[13], 1.8]
  	],
  	
	[ 6,//star
		[3000, 0, RAD[0], 1],
		[0, 1, RAD[4], 1],
		[0, 1, RAD[8], 1],
		[250, 2, RAD[12], 1],
		
		[3000, 2, RAD[2], 1],
		[0, 2, RAD[6], 1],
		[0, 3, RAD[10], 1],
		[250, 3, RAD[14], 1],
		
		[3000, 3, RAD[1], 1],
		[0, 4, RAD[5], 1],
		[0, 4, RAD[9], 1],
		[250, 5, RAD[13], 1]
	],
	
	[ 5,//quad
		[1250, 0, RAD[13], .8],
		[750, 1, RAD[14], .8],
		[750, 1, RAD[15], .8],

		[1250, 1, RAD[9], .9],
		[750, 2, RAD[10], .9],
		[750, 2, RAD[11], .9],

		[1250, 2, RAD[5], 1],
		[750, 3, RAD[6], 1],
		[750, 3, RAD[7], 1],

		[1100, 3, RAD[1], 1.1],
		[1100, 4, RAD[2], 1.1],
		[1100, 4, RAD[3], 1.1]
	],

	[ 5,//rand
		[750, 0, RAD[0], .8],
		[1100, 1, RAD[3], .8],
		[1100, 1, RAD[6], .8],
		[1100, 2, RAD[9], .8],
		[1100, 2, RAD[12], .8],
		[750, 2, RAD[15], .8],
		
		[1100, 3, RAD[2], .9],
		[1100, 3, RAD[5], .9],
		[1100, 4, RAD[8], .9],
		[1100, 4, RAD[11], .9],
		
		[750, 2, RAD[14], 1],
		[1100, 2, RAD[1], 1],
		[1100, 2, RAD[4], 1],
		[1100, 1, RAD[7], 1],
		[1100, 1, RAD[10], 1],
		[750, 0, RAD[13], 1]
	]
	
	
	
	
];   	
     
















