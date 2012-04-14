var Quality = {
	LOW : 0,
	NORMAL : 1,
	MASTERWORK : 2
}

var Material = {
	NONE : {value: 0, flammable: false, rusts: false},
	METAL: {value: 1, flammable: false, rusts: true},
	WOOD : {value: 2, flammable: true, rusts: false},
	CLOTH : {value: 3, flammable: true, rusts: false},
	LEATHER : {value: 4, flammable: false, rusts: false},
	DRAGONSCALE : {value: 5, flammable: false, rusts: false}
}

var Size = {
	FINE :       {value: 0, sizeMod: 8, miscMod: 16, name: "Fine", code: "F"},
	DIMINUTIVE : {value: 1, sizeMod: 4, miscMod: 12, name: "Diminutive", code: "D"},
	TINY :       {value: 2, sizeMod: 2, miscMod: 8, name: "Tiny", code: "T"},
	SMALL :      {value: 3, sizeMod: 1, miscMod: 4, name: "Small", code: "S"},
	MEDIUM:      {value: 4, sizeMod: 0, miscMod: 0, name: "Medium", code: "M"},
	LARGE :      {value: 5, sizeMod: -1, miscMod: -4, name: "Large", code: "L"},
	HUGE :       {value: 6, sizeMod: -2, miscMod: -8, name: "Huge", code: "H"},
	GARGANTUAN : {value: 7, sizeMod: -4, miscMod: -12, name: "Gargantuan", code: "G"},
	COLOSSAL :   {value: 8, sizeMod: -8, miscMod: -16, name: "Colossal", code: "C"}
}

function point3d(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	return this;
}

function tile(x,y){
	this.name = "grass";
	this.description = "";
	this.image = new Image();
	this.image.src = "";
	this.color = "#FFF";
	this.x = x;
	this.y = y;
	this.h = 32;
	this.w = 32;
	this.wall = false;

	this.draw = function(canvas){
		if (this.image.src != ""){
			//canvas.drawImage(this.image, this.x * tileSize, this.y * tileSize, cz(100), cz(100));
			canvas.drawImage(this.image, this.x * cz(tileSize), this.y * cz(tileSize), cz(tileSize), cz(tileSize));
		}
		else{
			canvas.fillStyle = this.color;
			canvas.fillRect(this.x * 32, this.y * 32, this.width, this.height);
		}
	}

	this.over = function(canvas){
		canvas.globalAlpha = 0.5;
		canvas.fillStyle = "blue";
		canvas.fillRect(this.x * tileSize, this.y * tileSize, this.w, this.w);
		canvas.globalAlpha = 1;
		this.draw(canvas);
	}

	this.eleAtPoint = function(x,y){
		if (x == this.x && y == this.y){//if(x < this.x + this.w && x > this.x && y > this.y && y < this.y + this.h){
			return true;
		}
		return false;
	}

	tiles.push(this);
	return this;
}

function entity(){
	this.name = "";
	this.description = "";
	this.color = "#000";
	this.image = new Image();
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.width = 1;
	this.height = 1;
	this.size = Size.MEDIUM;
	this.weight = 0;
	this.HP = 0;

	this.visible = true;
	this.poisoned = false;

	this.setImage = function(imgName){
		this.image.src = spritePath + imgName;
	}

	this.setLocation = function(loc){ this.x = loc.x; this.y = loc.y; this.z = loc.z; }
	this.getLocation = new point3d(this.x, this.y, this.z);

	this.getWeight = function() {
		return this.Weight;
	}

	this.over = function(canvas){
		canvas.shadowOffsetX = 0;
		canvas.shadowOffsetY = 0;
		canvas.shadowBlur = 5;
		canvas.shadowColor = "white";
		this.draw(canvas);
		canvas.shadowBlur = 0;
		canvas.shadowColor = null;
	}

	this.draw = function(canvas){
		if (this.image.src != ""){
			canvas.drawImage(this.image, this.x * cz(tileSize), this.y * cz(tileSize), this.width * cz(tileSize), this.height * cz(tileSize));
		}
		else{
			canvas.fillStyle = this.color;
			canvas.fillRect(this.x * cz(tileSize), this.y * cz(tileSize), this.width * cz(tileSize), this.height * cz(tileSize));
		}
	}

	return this;
}

function light(){
	this.color = "#fff";
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.h = 1;
	this.w = 1;
	this.visible = true;
	this.brightness = 1;
}

function mobile(){
	var self = new entity();
	self.isFemale = false;
	mobiles.push(self);

	return self;
}

function item(){
	var self = new entity();
	self.weight = 10;
	self.cursed = false;
	self.magical = false;
	self.poisoned = false;
	self.identified = false;
	self.Enchantment = 0;
	self.Amount = 0;
	items.push(self);

	return self;
}
//alert(item().color);

function container(){
	var self = new item();
	self.contents = [];
	self.totalWeight = 0;
	self.weightReduction = 0;
	self.spaceMax = 0;
	self.lockDC = 0;

	self.extraDimensional = false;
	self.locked = false;
	self.setImage("I_Chest01.png");

	self.open = function(m){
		if (Locked) {
			if (m != null)
				m.Message("Locked!");
		}
		return true;
	}

	self.addItem = function(x){
		self.contents.push(x);
	}

	self.removeItem = function(x){
		self.contents.remove(x);
	}

	self.checkHold = function(x, m){
		if (m != null)
			return true;
		if (x != null){
			if (x.weight + self.getWeight() < self.totalWeight)
				return true;
		}
		return false;
	}

	self.reOrder = function(x){
		for (i=0;i<x.length;i++){
			self.contents.splice()
		}
		self.Contents = x;
	}

	self.moveItem = function(x,y){
		var item = x;
		self.Contents.remove(x);
		self.Contents.splice(y,0,item);
	}

	self.displayContents = function(){

	}

	self.getWeight = function(){
		self.totalWeight = 0;
		for (i=0;i<self.contents.length;i++){
			if (self.contents[i].getWeight() != null && self.contents[i].getWeight() != 0)
				self.totalWeight += self.contents[i].getWeight();
		}
		return self.WeightReduction > 0 ? parseInt(self.totalWeight - (self.totalWeight*(self.weightReduction/100))) : self.totalWeight;
	}

	return self;
}

function weapon(){
	var self = new item();

	return self;
}

function spear(){
	var self = new weapon();
	self.setImage("W_Spear001.png");

	return self;
}

function sword(){
	var self = new weapon();
	self.setImage("W_Sword001.png");

	return self;
}

function armor(){
	var self = new item();

	return self;
}

function leatherArmor(){
	var self = new armor();
	self.setImage("A_Armour01.png");

	return self;
}

function Map(image){
	this.image = new Image();
	this.color = "#ccc";

	this.width = 960;
	this.height = 667;
	this.tileSize = 32;
	this.x = 0;
	this.y = 0;

	this.mobiles = [];
	this.items = [];
	this.tiles = [];

	this.load = function(){
		this.tiles = [];
	}

	if (image != null && this.image != null){
		this.image.src = image;
	}

	this.update = function(){

	}

	this.draw = function(canvas){
		if (this.image != null && (this.image.src != null)){
			canvas.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, cz(this.width), cz(this.height));
		}
		else{
			canvas.fillStyle = this.color;
			canvas.fillRect(this.x * tileSize, this.y * tileSize, cz(this.width), cz(this.height));
		}
	}

	return this;
}