function Pattern(data, offset){
	this.data = data;
	
	this.generate = this.getGenerate(data[0]);
	this.currentIndex = 1;
	this.delay = data[0] +(offset || 0);
}

Pattern.prototype = {
	update : function( delta){
		this.delay -= delta;
		
		while(this.delay < 0){
			var data = this.data[ this.currentIndex++];
			this.spawn(data);
			
			if(this.currentIndex >= this.data.length)
				return this.delay;
			
			this.delay += this.data[ this.currentIndex][0];
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
		
		var entity = new Entity( 100, i[2],  i[3], p[0], p[1]);
		entity.time -= this.delay;
		
		em.pushEntity( entity);
	}
};

var RAD =[
		Math.PI /16 *0,
		Math.PI /16 *1,
		Math.PI /16 *2,
		Math.PI /16 *3,
		Math.PI /16 *4,
		Math.PI /16 *5,
		Math.PI /16 *6,
		Math.PI /16 *7,
		Math.PI /16 *8,
		Math.PI /16 *9,
		Math.PI /16 *10,
		Math.PI /16 *11,
		Math.PI /16 *12,
		Math.PI /16 *13,
		Math.PI /16 *14,
		Math.PI /16 *15
	];

	/*delay(ms) / parterneId / angle(rad) / speed(coef)*/
PATTERN = [
	[ 6,//sphere
		[ 0, 0, RAD[0], 1],
		[250, 0, RAD[1], 1],
		[250, 0, RAD[2], 1],
		[250, 0, RAD[3], 1],
		[250, 0, RAD[4], 1],
		[250, 0, RAD[5], 1],
		[1500, 0, RAD[6], 1],
		[250, 0, RAD[7], 1],
		[250, 0, RAD[8], 1],
		[250, 0, RAD[9], 1],
		[250, 0, RAD[10], 1],
		[250, 0, RAD[11], 1]
	]
];   	
     
















