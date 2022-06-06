class Player {
	constructor(x, y, imageSource){
		this.x = x;
		this.y = y;
		this.ship = new Image();
		this.ship.src = imageSource;
		this.left = 0;
		this.right = 0;
		this.shoot = 0;
	}

}

class Bullet{
	constructor(x, y, imageSource){
		this.x = x;
		this.y = y;
		this.img = new Image();
		this.img.src = imageSource;
	}
}

class Enemy{
	constructor(x, y, imageSource){
		this.x = x;
		this.y = y;
		this.ship = new Image();
		this.ship.src = imageSource;
	}

}

class EnemyBullet{	
	constructor(x, y, imageSource){
		this.x = x;
		this.y = y;
		this.img = new Image();
		this.img.src = imageSource;
	}
}

class Overlay{
	constructor(imageSource){
		this.img = new Image();
		this.img.src = imageSource;
	}
}

let background, startMenuSingleplayer, startMenuMultiplayer, finishMenuBackground, instructions;
let canvas;
let ctx;
let buffer;
let xcoor, ycoor;
let index;
let fullHealth = 3;
let health = fullHealth;
let cnt = 0;
let gameState = 0;
let score = 0;
let highscore = 0;
let multiplayer = false;
let startMenuState = 0;
let generateSpeed = 150;
let shootingSpeed = 50;

let player;
let scoreImg
let hearts = [];

let bullets = [];
let bullets2 = [];
let enemyBullets = [];
let enemies = [];

function initBackground(){
	//init background
	background = new Image();
	background.src = "Assets/background.jpg";
	finishMenuBackground = new Image();
	finishMenuBackground.src = "Assets/finishMenuBackground.png";
	startMenuSingleplayer = new Image()
	startMenuSingleplayer.src = "Assets/startMenuSingleplayer.png";
	startMenuMultiplayer = new Image()
	startMenuMultiplayer.src = "Assets/startMenuMultiplayer.png";
	startMenuInstructions = new Image()
	startMenuInstructions.src = "Assets/startMenuInstructions.png";
	instructions = new Image()
	instructions.src = "Assets/instructions.png";
	
}

function initElements(){
	//create canvas element
	canvas = document.createElement("canvas");

	//set canvas size
	canvas.width = 700;
	canvas.height = window.innerHeight - 20;

	//get context of canvas
	ctx = canvas.getContext("2d");
	buffer = canvas.getContext("2d");

	//append canvas to body
	document.body.appendChild(canvas);

}

function drawBackground () {

	//set backround image of canvas
	ctx.drawImage(background, 0, -1, 700, window.innerHeight - 1);
}

function playerRelease (e) {

	//<-
	if((e.keyCode == "37")){
		player.left = 0;
	}
	//->
	else if ((e.keyCode == "39")){
		player.right = 0;
	}
	// spacebar
	else if((e.keyCode == "32")){
		player.shoot = 0;
	}

	// A
	if((e.keyCode == "65")){
		player2.left = 0;
	}
	// D
	else if ((e.keyCode == "68")){
		player2.right = 0;
	}
	// S
	else if((e.keyCode == "83")){
		player2.shoot = 0;
	}

}

function playerInput (e) {

	//check for pressed buttons
	//<-
	if ((e.keyCode == "37") && player.x > 60){
		player.left = 1;
		player.x -= 5;
	}
	//->
	else if ((e.keyCode == "39") && player.x < canvas.width - 20) {
		player.right = 1;
		player.x += 5;
	}
	// spacebar
	else if (e.keyCode == "32" && player.shoot == 0 ) {
		bullets.push(new Bullet(player.x - 25, player.y, "Assets/bullet.png"));
		updateBullets();
		player.shoot = 1;
	}

	// A
	if ((e.keyCode == "65") && player2.x > -20){
		player2.left = 1;
		player2.x -= 5;
	}

	// D
	else if ((e.keyCode == "68") && player2.x < canvas.width - 100) {
		player2.right = 1;
		player2.x += 5;
	}

	// S
	else if (e.keyCode == "83" && player2.shoot == 0 ) {
		bullets2.push(new Bullet(player2.x + 55, player2.y, "Assets/bullet.png"));
		updateBullets();
		player2.shoot = 1;
	}
}

function fluidMovement () {

	if (player.left  && player.x > 60){
		player.right = 0;
		player.x -= 5;
	}

	else if (player.right && player.x < canvas.width - 20) {
		player.left = 0;
		player.x += 5;
	}


	if (player2.left  && player2.x > - 20 && multiplayer){
		player2.right = 0;
		player2.x -= 5;
	}

	else if (player2.right && player2.x < canvas.width - 100 && multiplayer) {
		player2.left = 0;
		player2.x += 5;
	}
		
}

function drawPlayer () {
	//draw player spaceship at current location
	buffer.drawImage(player.ship, player.x-60, player.y, 80, 60)
	if(multiplayer){
		buffer.drawImage(player2.ship, player2.x+20, player2.y, 80, 60)
	}
}

function updateBullets () {

	for(let i = 0; i < bullets.length; i++){
		bullets[i].y -= 5;

		if(bullets[i].y <= - 20)
			bullets.splice(i, 1);
	}

	if(multiplayer){
		for(let i = 0; i < bullets2.length; i++){
			bullets2[i].y -= 5;
	
			if(bullets2[i].y <= - 20)
				bullets2.splice(i, 1);
		}
	}
	
	for(let i = 0; i < enemyBullets.length; i++){
		
		enemyBullets[i].y += 3;
		
		if(enemyBullets[i].y > canvas.height)
		enemyBullets.splice(i, 1);
		
	}
	
	collisionDetection();
}

function drawBullets () {

	if(bullets.length == 0 && enemyBullets.length == 0 && bullets2.length == 0)
		return;

	for(let i = 0; i < bullets.length; i++){
		buffer.drawImage(bullets[i].img, bullets[i].x, bullets[i].y, 5, 20)
	}

	for(let i = 0; i < enemyBullets.length; i++){
		buffer.drawImage(enemyBullets[i].img, enemyBullets[i].x, enemyBullets[i].y, 5, 20)
	}

	if(multiplayer){
		for(let i = 0; i < bullets2.length; i++){
			buffer.drawImage(bullets2[i].img, bullets2[i].x, bullets2[i].y, 5, 20)
		}
	}

	for(let i = 0; i < enemyBullets.length; i++){
		buffer.drawImage(enemyBullets[i].img, enemyBullets[i].x, enemyBullets[i].y, 5, 20)
	}

	updateBullets();
}

function generateEnemies () {

	if(cnt % generateSpeed == 0){
		enemies.push(new Enemy(Math.floor(Math.random() * (canvas.width - 60)), -50, "Assets/enemy.png"));
		if(generateSpeed > 30)
			generateSpeed -= 5;
	}
	updateEnemies();

	cnt++;
}

function healthEngine(){

	for(let i = 0; i < enemyBullets.length; i++){

		if(((enemyBullets[i].x - player.x) < 20 && (enemyBullets[i].x - player.x) > - 65) && ((enemyBullets[i].y - player.y) > 5)){
			enemyBullets.splice(i, 1);
			health -= 1;
		}

	}

	for(let i = 0; i < enemyBullets.length; i++){

		if(((enemyBullets[i].x - player2.x) < 60 && (enemyBullets[i].x - player2.x) > -25) && ((enemyBullets[i].y - player2.y) > 5)  && multiplayer){
			enemyBullets.splice(i, 1);
			health -= 1;
		}

	}

	drawOverlays();

	if(health == 0){
		gameState = 2;
	}

}

function initOverlays(){

	hearts[1] = new Overlay("Assets/fullHeart.png");
	hearts[0] = new Overlay("Assets/emptyHeart.png");

	scoreImg = new Overlay("Assets/score.png");

}

function drawOverlays(){

	for(let i = 0; i < fullHealth; i++){
		if(i + 1 > health){
			buffer.drawImage(hearts[0].img, 10 + (30 * i), 10, 25, 22);
		} 
		else {
			buffer.drawImage(hearts[1].img, 10 + (30 * i), 10, 25, 22);
		}
	}

	buffer.drawImage(scoreImg.img, canvas.width - 135, 10, 80, 20);
	buffer.font = "25px Arial";
	buffer.fillStyle = 'white';
	buffer.fillText(score, canvas.width - 45, 31);

}

function generateEnemyBullets () {

	if(cnt % shootingSpeed == 0 && enemies.length > 0){

		index = enemies.length - 1;

		xcoor = enemies[index].x;
		ycoor = enemies[index].y;

		enemyBullets.push(new EnemyBullet(xcoor + 23, ycoor, "Assets/bullet.png"));

		if(shootingSpeed > 20)
			shootingSpeed -= 1;

	}
	
	updateBullets();

}

function updateEnemies () {
	for(let i = 0; i < enemies.length; i++){
		enemies[i].y += 1;
		
		if(enemies[i].y > canvas.height)
			enemies.splice(i, 1);

	}
}

function drawEnemies () {

	for(let i = 0; i < enemies.length; i++){
		buffer.drawImage(enemies[i].ship, enemies[i].x, enemies[i].y, 50, 50);
	}

	updateEnemies();
}

function collisionDetection () {

	for(let i = 0; i < bullets.length; i++){
		for(let j = 0; j < enemies.length; j++){

			if(((bullets[i].x - enemies[j].x - 25) < 25 && (bullets[i].x - enemies[j].x - 25) > - 25) && ((bullets[i].y - enemies[j].y) < 25)){
				bullets.splice(i, 1);
				enemies.splice(j, 1);
				score += 10;
				break;
			}

		}
	}

	for(let i = 0; i < bullets2.length; i++){
		for(let j = 0; j < enemies.length; j++){

			if(((bullets2[i].x - enemies[j].x - 25) < 25 && (bullets2[i].x - enemies[j].x - 25) > - 25) && ((bullets2[i].y - enemies[j].y) < 25)){
				bullets2.splice(i, 1);
				enemies.splice(j, 1);
				score += 10;
			}

		}
	}

}

function gameplay(){

	fluidMovement();
	drawBackground();
	generateEnemies();
	generateEnemyBullets();
	healthEngine();
	drawBullets();
	drawEnemies();
	drawPlayer();

}

function draw () {

	switch(gameState) {
		case 0:
			drawStartMenu();
			break;
		case 1:
			gameplay();
			break;
		case 2:
			drawFinishMenu();
			break;
		case 3:
			drawInstructions();
	}
	window.requestAnimationFrame(draw);
}

function drawStartMenu(){

	if(startMenuState == 1){
		ctx.drawImage(startMenuMultiplayer, 0, -1, 700, window.innerHeight - 1);
	}
	else if(startMenuState == 0){
		ctx.drawImage(startMenuSingleplayer, 0, -1, 700, window.innerHeight - 1);
	}
	else{
		ctx.drawImage(startMenuInstructions, 0, -1, 700, window.innerHeight - 1);
	}

}

function drawInstructions(){
	ctx.drawImage(instructions, 0, -1, 700, window.innerHeight - 1);
}

function checkNavigationInput(e){

	if (e.keyCode == "13"){
		if(gameState == 2 || gameState == 3){
			gameState = 0;
			resetParameters();
		}
		else if(startMenuState == 1){
			multiplayer = true;
			gameState = 1;
			resetParameters();
			document.removeEventListener('keydown', checkNavigationInput);
		}
		else if(startMenuState == 0){
			multiplayer = false;
			gameState = 1;
			resetParameters();
			document.removeEventListener('keydown', checkNavigationInput);
		}
		else if(startMenuState == 2){
			gameState = 3;
		}
	}
	else if(e.keyCode == "27"){
		gameState == 0;
	}
	else if(e.keyCode == "40" && gameState == 0 && startMenuState < 3){
		startMenuState += 1;
	}
	else if(e.keyCode == "38" && gameState == 0 && startMenuState > 0){
		startMenuState -= 1;
	}


}

function resetParameters(){
	health = fullHealth;
	enemies = [];
	bullets = [];
	enemyBullets = [];
	cnt = 0;
	player.x = canvas.width/2 - 20;
	score = 0;
}

function drawFinishMenu(){

	if(score > highscore){
		highscore = score;
	}

	document.addEventListener('keydown', checkNavigationInput);
	ctx.drawImage(finishMenuBackground, 0, -1, 700, window.innerHeight - 1);

	buffer.font = "25px Arial";
	buffer.fillStyle = 'white';
	buffer.fillText(score, canvas.width/2 + 70, canvas.height/2 - 12);
	buffer.font = "25px Arial";
	buffer.fillStyle = 'white';
	buffer.fillText(highscore, canvas.width/2 + 60, canvas.height/2 + 32);


}

function init () {
	document.addEventListener('keydown', playerInput);
	document.addEventListener('keyup', playerRelease);
	document.addEventListener('keydown', checkNavigationInput);
	initElements(); 
	initBackground();
	initOverlays();

	player = new Player(canvas.width/2 - 20, canvas.height-70, "Assets/ship.png");
	player2 = new Player(canvas.width/2 - 20, canvas.height-70, "Assets/ship2.png");


	//start game
	draw();
}
