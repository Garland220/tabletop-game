var FPS = 30;
var zoom = 1.0;

var tileSize = 32;
var height = 600;
var width = 800;

var spritePath = "resources/img/icons/items/";

var mobiles = [];
var items = [];
var tiles = [];

var cnv;
var grid;

$(document).ready(function(){
	height = $("#gameScreen").height();
	width = $("#gameScreen").width();

	$(document).bind("keydown", "left", function(){});

	cnv = document.getElementById('gameScreen');
	cnv.onmousemove = over;

	initializeGame();
});

function Game(){
	var FPS = 30;
	var zoom = 1.0;

	var tileSize = 32;
	var height = 600;
	var width = 800;

	var spritePath = "resources/img/icons/items/";

	var mobiles = [];
	var items = [];
	var tiles = [];

	var cnv;
	var grid;
}

function GameGrid(context,map) {
	this.sq = [];
	this.dirty = [];
	this.ctx = context;
	this.map = map
	this.x = 0;
	this.y = 64;
	this.mouseX = 0;
	this.mouseY = 0;

	this.init = function(){
		this.update();
		this.draw();
	}

	this.update = function(){
		this.sq = [];

		height = $("#gameScreen").attr("height");
		width = $("#gameScreen").attr("width");
		//height = $("#gameScreen").height();
		//width = $("#gameScreen").width();

		var gridHeight = Math.ceil(height/tileSize);
		var gridWidth = Math.ceil(width/tileSize);

		for(var x=0; x<gridWidth; x++) {
			for(var y=0; y<gridHeight; y++) {
				this.sq.push(new square(x,y));
			}
		}
	}

	this.zoomTo = function(n){
		this.clear;
		zoom = n;
		$("#zoom").val(zoom);
		this.draw();
	}

	this.zoom = function(delta){
		if (!isNaN(delta))
			zoom = zoom + (delta/10);
		if (zoom < 0.5)
			zoom = 0.5;
		else if (zoom > 2.0)
			zoom = 2.0;
		this.zoomTo(zoom);
	}

	this.draw = function(){
		this.clear();

		this.map.draw(this.ctx);

		for(var i=0; i < tiles.length; i++){
			//tiles[i].draw(this.ctx);
		}
		//renderGrid(32,"#fff");
		for(var i=0; i < this.sq.length; i++){
			if (this.mouseX == this.sq[i].x && this.mouseY == this.sq[i].y){
				this.sq[i].over(this.ctx);
			}
			else{
				this.sq[i].draw(this.ctx);
			}
		}
		for(var i=0; i<items.length;i++){
			if (items[i].visible){
				if (this.mouseX == items[i].x && this.mouseY == items[i].y){
					items[i].over(this.ctx);
				}
				else{
					items[i].draw(this.ctx);
				}
			}
		}
		for(var i=0; i<mobiles.length;i++){
			if (mobiles[i].visible){
				mobiles[i].draw(this.ctx);
			}
		}

		//if (zoom < 1.0){
			//grayscale(this.ctx);
		//}
		/*
		this.ctx.globalAlpha = 0.5;
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, width, height);
		this.ctx.globalAlpha = 1;*/
	}

	this.clear = function(){
		//this.ctx.clearRect(0,0,width,height);
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, width, height);
	}

	this.clean = function(){
		for(var i=0; i < this.dirty.length; i++){
			this.dirty[i].draw(this.ctx);
		}
		this.dirty = [];
	}

	this.over = function(x,y){
		x = Math.floor((x - this.map.x - this.x) / (tileSize * zoom));
		y = Math.floor((y - this.map.y - this.y) / (tileSize * zoom));
		if (x < 0 || y < 0){
			return;
		}
		this.mouseX = x;
		this.mouseY = y;
		$("#pos").val("x:"+this.mouseX +" / y:"+ this.mouseY);

		/*x = Math.ceil((x - this.map.x) / tileSize);
		y = Math.ceil((y - this.map.y) / tileSize);
		for(var i=0; i < this.sq.length; i++){
			if(this.sq[i].eleAtPoint(x,y)){
				this.clean(); // clean up
				this.dirty.push(this.sq[i]);
				this.sq[i].over(this.ctx);
				break;
			}
		}*/
	}

	this.init();
	this.draw();
}

function camera(){
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;

	this.width = function(){ return getScale(this.w); }
	this.height = function(){ return getScale(this.h); }

	this.map = map;
	this.scale = zoom;

	function getScale(i){
		return i * scale;
	}

	this.draw = function(canvas){
		this.clear();

		this.map.draw(canvas);
		/*for(var i=0; i < this.sq.length; i++){
			if (this.mouseX == this.sq[i].x && this.mouseY == this.sq[i].y){
				this.sq[i].over(canvas);
			}
			else{
				this.sq[i].draw(canvas);
			}
		}*/
		for(var i=0; i<items.length;i++){
			if (items[i].visible){
				if (this.mouseX == items[i].x && this.mouseY == items[i].y){
					items[i].over(canvas);
				}
				else{
					items[i].draw(canvas);
				}
			}
		}
		for(var i=0; i<mobiles.length;i++){
			if (mobiles[i].visible){
				mobiles[i].draw(canvas);
			}
		}
		for(var i=0; i < tiles.length; i++){
			tiles[i].draw(canvas);
		}
	}

	this.clear = function(){
		canvas.clearRect(0,0,width,height);
		//canvas.fillStyle = "#000";
		//canvas.fillRect(0, 0, width, height);
	}
}

function cz(i){
	return i * zoom;
}

function square(x,y){
	this.x = x;
	this.y = y;
	this.h = 32;
	this.w = 32;
	this.wall = false;

	this.draw = function(canvas){
		canvas.strokeStyle = "#ccc";
		canvas.strokeRect(this.x * cz(tileSize), this.y * cz(tileSize), cz(this.w), cz(this.h));
	}

	this.over = function(canvas){
		canvas.globalAlpha = 0.5;
		canvas.fillStyle = "blue";
		canvas.fillRect(this.x * cz(tileSize), this.y * cz(tileSize), cz(this.w), cz(this.w));
		canvas.globalAlpha = 1;
		this.draw(canvas);
	}

	this.eleAtPoint = function(x,y){
		if (x == this.x && y == this.y){//if(x < this.x + this.w && x > this.x && y > this.y && y < this.y + this.h){
			return true;
		}
		return false;
	}
}

function draw(){
	
}

function over(e){
	if (e != null){
		grid.over(e.clientX, e.clientY);
	}
}

function loadGrid(map){
	grid = new GameGrid(cnv.getContext("2d"), map);
	//grid.x = $(cnv).offset();
}

function initializeGame(){
	$('#gameScreen').click(function(event) { });
	$('#gameScreen').mousewheel(function(event, delta) {
		grid.zoom(delta);
	});

	var map = new Map("resources/img/maps/frostsilver.jpg");

	loadGrid(map);

	setInterval(function() {
		grid.update();
		grid.draw();
	}, 1000/FPS);

	c = new sword();
	c.x = 10;
	c.y = 9;
	
	//c = new tile(11,10);

	c = new leatherArmor();
	c.x = 3;
	c.y = 6;

	c = new spear();
	c.x = 9;
	c.y = 9;

	c = new container();
	c.x = 5;
	c.y = 4;
}

function addItem(item){

}

var tId, idleTimer;
function initReload() { 
	//clearInterval(tId);
	//tId = setInterval(checklatestmsgidLive, 10000 );
}

window.onload = window.onfocus = function(){
	initReload()
}

window.onblur = function(){
	clearInterval(tId);
}

window.onmousemove = function(){
	clearTimeout(idleTimer);
	idleTimer = setTimeout(function() { clearInterval(tId);},600000); // idle for 10 minutes
}