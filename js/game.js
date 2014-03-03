function Game(){
	this.run = false;
	this.active = 0;
	this.lastUpdate = 0;
	this.guiList = [];
	this.activeGui = undefined;
}

Game.prototype = {
	start : function(){
		if(this.run)
			return;

		this.run = true;
		this.lastUpdate = Date.now();
		
		this.update(this);
	},
		
	stop : function(){
		this.run = false;
	},
	
	update : function(self){
		if(!this.run)
			return;
		
		if(this.activeGui === undefined)
			return this.stop();
			
		var delta = Date.now() - this.lastUpdate;
		this.lastUpdate = Date.now();
		
		this.activeGui.update(delta);
		this.activeGui.render();

		requestAnimationFrame( function(){ self.update(self); } );
	},
	
	openGui : function(id){
		if(this.activeGui !== undefined)
			this.activeGui.removeEvent();
		
		this.activeGui = this.guiList[id];
		console.log(this.activeGui);
		if(this.activeGui !== undefined)
			this.activeGui.bindEvent();
	}
};
var count = 5;

/*

if( this.count <= 0 ){
	this.count = 50;
	em.spawn();
}else
	this.count--;

player.update(delta);

player.drawBackground();

em.updateAndDraw(delta);
player.draw();

requestAnimationFrame( function(){ self.update(self); } );
*/