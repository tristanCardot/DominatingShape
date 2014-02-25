/**@constructor
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 */
function Color( r, g, b ){
	/** @type {Number}*/ this.r = r;
	/** @type {Number}*/ this.g = g;
	/** @type {Number}*/ this.b = b;
}

Color.prototype = {
	/**Récupére la couleur avec une modification de la saturation/luminosités
	 * @param {Number} value
	 * @return {String}
	 */
	evaluate : function( value ){
		return Color.toString(
			this.r *value,
			this.g *value,
			this.b *value
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
	
	/**Vérifie si les deux couleurs sont identiques.
	 * @param {Color} color
	 * @returns {Boolean}
	 */
	equal : function(color){
		return this.r === color.r && this.g === color.g && this.b === color.b;
	}
};

Color.toString = function( r, g, b ){
	return ( 16777216 + (r<<16) + (g<<8) + (b<<0) ).toString(16).slice(1); 
};

/**@type {Object}*/
var COLOR = [
	new Color(255,0,0),
	new Color(0,255,0), 
	new Color(0,0,255),
	new Color(255,255,0),
	new Color(0,255,255),
	new Color(255,0,255)
];

COLOR.RED = 0;
COLOR.GREEN = 1;
COLOR.BLUE = 2;
COLOR.YELLOW = 3;
COLOR.CYAN = 4;
COLOR.PURPLE = 5;
