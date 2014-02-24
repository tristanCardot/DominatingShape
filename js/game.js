/** @type {HTMLCanvasElement}*/
var CANVAS = document.createElement('canvas');
	CANVAS.height = window.innerHeight/4;
	CANVAS.width = window.innerWidth/4;

/**@type {CanvasRenderingContext2D}*/
var CTX = CANVAS.getContext('2d');

window.addEventListener('load', function(){
	document.body.appendChild(CANVAS);
}, false);

window.addEventListener('resize', function(){
	CANVAS.height = window.innerHeight/4;
	CANVAS.width = window.innerWidth/4;
}, false);

	CTX.strokeStyle = '#F00';
	CTX.fillStyle = '#A00';

var rotate = 0;
CTX.translate(CANVAS.width/2, CANVAS.height/2);

function Player(){
	this.shape;
	this.fromColor;
	this.color;
}

Player.prototype = {
};
