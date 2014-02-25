/**@constructor
 * @param
 */
function Shape( id, vertex ){
	this.id = id;
	this.vertex = vertex || [];
}

Shape.prototype = {
	drawOnPos : function(x, y, rotation, scale){
		CTX.translate( x, y );
		CTX.rotate( rotation );
		CTX.scale(scale, scale);
		
		CTX.beginPath();
		
		CTX.moveTo( this.vertex[0], this.vertex[1] );
		
		for(var i=2; i<this.vertex.length; i+=2)
			CTX.lineTo( this.vertex[i], this.vertex[i+1] );
		
		CTX.closePath();

		CTX.fill();
		CTX.stroke();

		CTX.scale(1/scale, 1/scale);
		CTX.rotate( -rotation );
		CTX.translate( -x, -y );
	}
};

/**@enum {Shape}*/
var SHAPE = [
	new Shape(0, [0,-10, 8.66,5, -8.66,5]),
	new Shape(1, [-7.07,-7.07, -7.07,7.07, 7.07,7.07, 7.07,-7.07]),
	new Shape(2, [0,-10, 9.51,-3.09, 5.88,8.09, -5.88,8.09, -9.51,-3.09]),
	new Shape(3, [0,-10, 8.66,-5, 8.66,5, 0,10, -8.66,5, -8.66,-5])
];

SHAPE.TRIANGLE = 0;
SHAPE.SQUARE = 1;
SHAPE.PENTAGON = 2;
SHAPE.HEXAGON = 3;



