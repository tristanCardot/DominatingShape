/** @type {HTMLCanvasElement}*/
var CANVAS = document.createElement('canvas');
	CANVAS.height = 400;
	CANVAS.width = 400;

/**@type {CanvasRenderingContext2D}*/
var CTX = CANVAS.getContext('2d');

window.addEventListener('load', function(){
	document.body.appendChild(CANVAS);
}, false);

window.addEventListener('resize', function(){
}, false);

CTX.translate(CANVAS.width/2, CANVAS.height/2);
CTX.lineWidth = 1.5;

var player = new Player(),
	em = new EntityManager();

var count = 0;
setInterval(function(){
	if(count<= 0){
		count = 200;
		em.spawn();
		
	}else
		count--;
	CTX.rotate(Math.PI/(250*count/10));
	CTX.clearRect(-CANVAS.width, -CANVAS.height, CANVAS.height*2, CANVAS.width*2);
	
	em.updateAndDraw(16);
	player.update(16);
},16);
