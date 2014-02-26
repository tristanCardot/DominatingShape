var SIZE = 200,
	SIZESQRT = Math.sqrt(200*200 +200*200)*1.1,
	PI2 = Math.PI *2;

/** @type {HTMLCanvasElement}*/
var CANVAS = document.createElement('canvas');
	CANVAS.height = SIZE*2;
	CANVAS.width = SIZE*2;

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

var count = 0, countP = 0;
setInterval(function(){
	if(count<= 0){
		count = 150;
		em.spawn();
	}else
		count--;

	if(countP<= 0){
		countP = 60;
		
		if(Math.random()*2<1)
			player.shape.morphing( Math.floor(Math.random() *SHAPE.length ) );
		else
			player.color.morphing( COLOR[ Math.floor(Math.random() *COLOR.length) ] );
		
	}else
		countP--;
	
	
	CTX.rotate(Math.PI /600);
	CTX.clearRect(-SIZESQRT, -SIZESQRT, SIZESQRT*2, SIZESQRT*2);

	player.update(16);
	player.drawBackground();
	em.updateAndDraw(16);
	player.draw();
},16);
