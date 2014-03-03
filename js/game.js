var SIZE = 200,
	SIZESQRT = Math.sqrt( SIZE *SIZE +SIZE *SIZE ) *1.1,
	PI2 = Math.PI *2,
	SCALE = {x:0, y:0};

/** @type {HTMLCanvasElement}*/
var CANVAS = document.createElement('canvas');
	CANVAS.height = SIZE*2;
	CANVAS.width = SIZE*2;

/**@type {CanvasRenderingContext2D}*/
var CTX = CANVAS.getContext('2d');

window.addEventListener('load', function(){
	SCALE.x = window.innerWidth /( SIZE *2);
	SCALE.y = window.innerHeight /( SIZE *2);
	
	document.body.appendChild(CANVAS);
}, false);

window.addEventListener('resize', function(){
	SCALE.x = window.innerWidth /( SIZE *2);
	SCALE.y = window.innerHeight /( SIZE *2);
}, false);

CTX.translate(CANVAS.width/2, CANVAS.height/2);
CTX.lineWidth = .20;
CTX.font = '40px sans-serif';


var player = new Player(),
	em = new EntityManager();

var count = 0, countP = 0;
setInterval(function(){
	if(count<= 0){
		count = 50;
		em.spawn();
	}else
		count--;
	
	CTX.clearRect(-SIZESQRT, -SIZESQRT, SIZESQRT*2, SIZESQRT*2);

	player.update(16);
	player.drawBackground();
	
	em.updateAndDraw(16);
	player.draw();
},16);
