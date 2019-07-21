class Hand {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.axis = [0, 0]; // Rotational axis relative to image position
		this.rotation = 0;
		this.image = null;
		this.width = 100;
		this.height = 100;
		this.scale = 1;
		this.ctx = null;
	}
	
	setContext(context) {
		this.ctx = context;
	}
	
	createImage(src) {
		this.image = new Image();
		this.image.src = src;
	}
	
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
	
	setAxis(x, y) {
		this.axis = [x, y];
	}
	
	scaleImage(scale) {
		this.width = this.width * scale;
		this.height = this.height * scale;
	}
	
	toRadians(degrees) {
		// Convert angle from degrees to radians
		return degrees * Math.PI / 180;
	}
	
	setRotation(rotation) {
		// Rotation in radians
		this.rotation = rotation;
	}
	
	rotate(degrees) {
		this.rotation = this.toRadians(degrees);
	}
	
	draw(canvas) {
		this.ctx.save();
		//this.ctx.setTransform(1, 0, 0, 1, this.x, this.y);
		this.ctx.translate(this.x, this.y); // Move to image origin (top left corner)
		this.ctx.translate(this.axis[0], this.axis[1]); // Move to image's rotational axis
		this.ctx.rotate(this.rotation);
		this.ctx.drawImage(this.image, -this.axis[0], -this.axis[1], this.height * this.image.width / this.image.height, this.height);
		//this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity matrix
		this.ctx.restore();
	}
}

function snapshotCanvas(canvas) {
	/* This is preferred over ctx.save() to save all the image data rather than just the
	canvas state */
	return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
}

function restoreCanvas(canvas, snapshot) {
	canvas.getContext("2d").putImageData(snapshot, 0, 0);
}

var canv = d3.select("#clock")
	.append("canvas")
	.attr("width", 1200)
	.attr("height", 1000);
	
var ctx = canv.node().getContext("2d");
//var snapshot = snapshotCanvas(canv.node());
var base = new Image();
base.src = "images/base.png";

var minHand = new Hand();
minHand.setContext(ctx);
minHand.createImage("images/minute_hand.png");
//minHand.setAxis(minHand.scale * minHand.width / 2, minHand.scale * 3 * minHand.height / 4);
minHand.setAxis(31, 130);
//minHand.setAxis(0, 0);
minHand.scaleImage(1.6);
minHand.setPosition(681, 325);

var hourHand = new Hand();
hourHand.setContext(ctx);
hourHand.createImage("images/hour_hand.png");
hourHand.setAxis(27, 105);
hourHand.scaleImage(1.25);
hourHand.setPosition(685, 350);

var secondHand = new Hand();
secondHand.setContext(ctx);
secondHand.createImage("images/second_hand.png");
secondHand.setAxis(12, 52);
secondHand.scaleImage(0.70);
secondHand.setPosition(772, 410);

var FPS = 60;
var time, hh, mm, ss;
var angleOffset = -82; // Pocketwatch in image is tilted anti-clockwise
var hhR, mmR, ssR;
time = new Date();
hh = time.getHours() % 12; // 12-hour time instead of 24-hour time
mm = time.getMinutes();
ss = time.getSeconds();

hhR = angleOffset + hh * 30;
mmR = angleOffset + mm * 6;
ssR = angleOffset + ss * 6;

window.onload = setInterval(() => {


	ctx.drawImage(base, 0, 0);
	//var snapshot = snapshotCanvas(canv.node());

	//restoreCanvas(canv.node(), snapshot)
	/*
	ctx.drawImage(minHand.image, minHand.x, minHand.y, minHand.height * minHand.image.width / minHand.image.height, minHand.height);
	ctx.drawImage(hourHand.image, hourHand.x, hourHand.y, hourHand.height * hourHand.image.width / hourHand.image.height, hourHand.height);
	ctx.drawImage(secondHand.image, secondHand.x, secondHand.y, secondHand.height * secondHand.image.width / secondHand.image.height, secondHand.height);
	*/

	hhR += 6 / (FPS * 60 * 60); // Gradually increment hand
	hourHand.rotate(hhR);

	mmR += 6 / (FPS * 60); // Gradually increment hand
	minHand.rotate(mmR);
	
	ssR += 6 / FPS;  // Gradually increment hand
	secondHand.rotate(ssR);
	
	minHand.draw(canv.node());
	hourHand.draw(canv.node());
	secondHand.draw(canv.node());
	
	//secondHand.rotate(canv.node(), ctx, 90);
	//restoreCanvas(canv.node(), snapshot);

}, 1000 / FPS);

var time = new Date();
var timeHours = time.getHours() % 12 || 12;
var timeMinutes = time.getMinutes();
var timeSeconds = time.getSeconds(); 
/*
var updateTime = setInterval(() => {
	var time = new Date();
	var timeHours = time.getHours() % 12 || 12;
	var timeMinutes = time.getMinutes();
	var timeSeconds = time.getSeconds(); 
	console.log(timeHours, timeMinutes, timeSeconds);
	}, 1000)
*/