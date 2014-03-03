/**@constructor
 * @param
 */
function Shape( id, sides ){
	this.id = id;
	this.vertex = [];
	
	for(var i=0; i<sides; i++)
		this.vertex.push(
			Math.sin( Math.PI *2 /sides *i ),
			-Math.cos( Math.PI *2 /sides *i )
		);
}

Shape.prototype = {
	draw : function(){
		CTX.beginPath();
		
		CTX.moveTo( this.vertex[0], this.vertex[1] );
		
		for(var i=2; i<this.vertex.length; i+=2)
			CTX.lineTo( this.vertex[i], this.vertex[i+1] );

		CTX.closePath();

		CTX.fill();
		CTX.stroke();
	},

	fill : function(ctx){
		ctx.scale( 5, 5 );
		ctx.beginPath();
		
		ctx.moveTo( this.vertex[0], this.vertex[1] );
		
		for(var i=2; i<this.vertex.length; i+=2)
			ctx.lineTo( this.vertex[i], this.vertex[i+1] );
		
		ctx.closePath();
		ctx.scale( 1/5, 1/5 );
		
		ctx.fill();
	}
};

/**@enum {Shape}*/
var SHAPE = [
	new Shape(0, 3),
	new Shape(1, 4),
	new Shape(2, 5),
	new Shape(3, 6)
];

SHAPE.TRIANGLE = 0;
SHAPE.SQUARE = 1;
SHAPE.PENTAGON = 2;
SHAPE.HEXAGON = 3;



