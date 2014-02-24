/**@constructor
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 */
function Color(r,g,b){
	/** @type {Number}*/ this.r = r;
	/** @type {Number}*/ this.g = g;
	/** @type {Number}*/ this.b = b;
}

Color.prototype = {
	/**Permet d'évaluer la transition entre deux couleurs
	 * @param {Color} target
	 * @param {Number} progress
	 * @return {String}
	 */
	updateTo : function(target, progress){
		return Color.toString(
			( target.r -this.r ) *progress +this.r,
			( target.g -this.g ) *progress +this.g,
			( target.b -this.b ) *progress +this.b
		);
	},

	/**Permet de convertir la couleur au format 0xRRGGBB
	 * @return {String}
	 */
	toString : function(){
		return ( 16777216 + (this.r<<16) + (this.g<<8) + this.b ).toString(16).slice(1); 
	},

	/**Permet de récupérer une copie de la couleur.
	 * @return {Color}
	 */
	clone : function(){
		return new Color(this.r, this.g, this.b);
	},

	equal : function(color){
		return this.r === color.r && this.g === color.g && this.b === color.b;
	}
};

Color.toString = function(r, g, b){
	return ( 16777216 + (r<<16) + (g<<8) + b ).toString(16).slice(1); 
};

/**@enum {Color}*/
var COLOR = {
	RED : new Color(255,0,0),
	GREEN : new Color(0,255,0),
	BLUE : new Color(0,0,255),
	CYAN : new Color()
};
