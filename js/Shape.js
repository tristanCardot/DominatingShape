/**@constructor
 * @param
 */
function Shape(vertex){
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
var SHAPE = {
	TRIANGLE : new Shape([0,-10, 8.66,5, -8.66,5]),
	SQUARE : new Shape([-1,-1, -1,1, 1,1, 1,-1]),
	PENTAGON : new Shape([0,-10, 9.51,-3.09, 5.88,8.09, -5.88,8.09, -9.51,-3.09]),
	HEXAGON : new Shape([0,-10, 8.66,-5, 8.66,5, 0,10, -8.66,5, -8.66,-5])
};