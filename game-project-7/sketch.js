/*

	Adam Drake - Game Project 7
	
	For my extensions I added sound, platforms and enemies. The part I found most difficult for this project would be the
	randomly generated position, size and orientation of the trees. It furthered my understanding of the scale and translate
	functions by implementing this, as a mix of both was required to get my trees facing the opposite direction while
	remaining in the same position.

*/

// Constants
var ZERO_VECTOR; // Can't declare this as a const as I can't use createVector before setup.
const gravity = 2;

// Position variables
var player_x;
var player_y;
var floorPos_y;
var scroll_pos;
var player_world_x;

// Gameplay variables
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var game_score;
var lives;
var game_time;

// Array variables
var clouds;
var mountains;
var trees;
var canyons;
var collectables;
var platforms;
var enemies;
var flagpole;

// Sound variables
var jump_sound;
var coin_sound;
var walk_sound;
var die_sound;
var win_sound;
var flag_sound;
var game_over_sound;

// Image variables
var enemy_left_image;
var enemy_right_image;

function startGame() {
	player_x = width / 2;
	player_y = floorPos_y;

	game_time = 0;
	game_score = 0;

	// Variable to control the background scrolling.
	scroll_pos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
	player_world_x = player_x - scroll_pos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	platforms = [
		createPlatform(createVector(1450, floorPos_y - 50), 100),
		createPlatform(createVector(1600, floorPos_y - 100), 100),
		createPlatform(createVector(1750, floorPos_y - 150), 100),
	];

	enemies = [new Enemy(createVector(2225, floorPos_y), 200)];

	// reset flag and collectables
	flagpole.isReached = false;
	for (const collectable of collectables) {
		collectable.isFound = false;
	}
}

function preload() {
	soundFormats("mp3", "wav");

	jump_sound = loadSound("assets/jump.wav");
	coin_sound = loadSound("assets/coin.wav");
	walk_sound = loadSound("assets/walk.wav");
	die_sound = loadSound("assets/die.wav");
	win_sound = loadSound("assets/win.mp3");
	flag_sound = loadSound("assets/flag.wav");
	game_over_sound = loadSound("assets/game_over.mp3");
	enemy_left_image = loadImage("assets/enemy_left.png");
	enemy_right_image = loadImage("assets/enemy_right.png");
}

function setup() {
	ZERO_VECTOR = createVector(0, 0);
	createCanvas(1024, 576);
	floorPos_y = (height * 3) / 4;
	lives = 3;

	walk_sound.setVolume(0.05);
	walk_sound.setLoop(true);
	walk_sound.playMode("untilDone");

	jump_sound.setVolume(0.08);
	coin_sound.setVolume(0.1);
	die_sound.setVolume(0.1);
	win_sound.setVolume(0.2);
	win_sound.setLoop(true);

	flag_sound.setVolume(0.1);
	game_over_sound.setVolume(0.2);

	// Initialise arrays of scenery objects.
	clouds = [
		{ x: -200, y: 160, width: random(180, 260), height: random(100, 130) },
		{ x: 200, y: 160, width: random(180, 260), height: random(100, 130) },
		{ x: 700, y: 130, width: random(180, 260), height: random(100, 130) },
		{ x: 1100, y: 190, width: random(180, 260), height: random(100, 130) },
		{ x: 1500, y: 160, width: random(180, 260), height: random(100, 130) },
		{ x: 1900, y: 180, width: random(180, 260), height: random(100, 130) },
	];
	mountains = [
		{ x: -100, y: floorPos_y, width: random(350, 350), height: random(100, 130) },
		{ x: 200, y: floorPos_y, width: random(550, 700), height: random(200, 260) },
		{ x: 400, y: floorPos_y, width: random(250, 350), height: random(100, 130) },
		{ x: 850, y: floorPos_y, width: random(150, 300), height: random(100, 130) },
		{ x: 1000, y: floorPos_y, width: random(550, 700), height: random(200, 260) },
		{ x: 1100, y: floorPos_y, width: random(250, 350), height: random(100, 130) },
		{ x: 1800, y: floorPos_y, width: random(550, 700), height: random(200, 260) },
	];
	canyons = [
		{ x: 850, width: 125 },
		{ x: 1500, width: 500 },
		{ x: 2450, width: 125 },
	];
	collectables = [
		{ x: 912, y: floorPos_y - 140, size: 60, isFound: false },
		{ x: 1650, y: floorPos_y - 310, size: 60, isFound: false },
		{ x: 2112, y: floorPos_y - 230, size: 60, isFound: false },
		{ x: 2512, y: floorPos_y - 140, size: 60, isFound: false },
	];

	flagpole = {
		x: 2700,
		reached_time: 0,
		isReached: false,
		pole_width: 5,
		pole_height: 200,
		pole_colour: [120, 120, 120],
		flag_colour: [255, 0, 0],
		flag_height: 66,
		flag_movement_speed: 60, // frames to move from top to bottom
	};

	// randomly generate trees
	trees = [];
	let tree_x = random(-300, 0);
	while (tree_x < flagpole.x + width) {
		tree_x += random(100, 150);
		const tree = {
			x: tree_x,
			y: floorPos_y,
			flipped: Math.random() < 0.5, // 50% chance of being true
			scale: constrain(random(0.65, 1.2), 0.65, 1), // make it more likely to get a larger number than a smaller one
		};
		trees.push(tree);
	}

	// randomly generate clouds
	clouds = [];
	let cloud_x = -200;
	while (cloud_x < flagpole.x + width) {
		cloud_x += random(100, 250);
		const cloud = {
			x: cloud_x,
			y: random(75, 200),
			width: random(180, 260),
			height: random(100, 130),
			update: function () {
				this.x += 0.1;
				if (this.x > flagpole.x + width) {
					this.x = -260;
				}
			},
		};
		clouds.push(cloud);
	}

	startGame();
}

function drawPlatforms() {
	for (const platform of platforms) {
		platform.draw();
	}
}

function draw() {
	// Using this in place of frameCount as I want to be able to reset it to 0.
	game_time += 1;

	// background
	background(100, 155, 255);
	gradient(0, 0, width, height, color(90, 155, 255), color(200, 155, 255), 15);

	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height / 4); // draw some green ground
	fill(122, 91, 61);
	rect(0, floorPos_y + 20, width, height / 4 - 20);

	// translate to give the effect of scrolling
	push();
	translate(scroll_pos, 0);
	{
		// Draw mountains.
		parallax(-scroll_pos / 1.5, 0, drawMountains); // mountains should move slower than trees

		// Draw clouds.
		parallax(-scroll_pos / 1.75, 0, drawClouds); // clouds should move slower than trees
		for (const cloud of clouds) {
			cloud.update();
		}

		// Draw trees.
		drawTrees();

		// Draw canyons
		drawCanyons();

		// Draw platforms
		drawPlatforms();

		// Draw collectable items
		drawCollectables();

		// Draw flagpole
		if (flagpole.isReached === false) {
			checkFlagpole();
		}
		renderFlagpole();

		// Draw enemies
		for (const enemy of enemies) {
			enemy.update();
			enemy.draw();
		}
	}
	pop();

	// Draw game character.
	if (lives > 0) {
		drawGameChar();
	}

	// Display score
	drawScore();
	drawLives();

	// Display message if game is over
	if (lives < 1) {
		displayContinueMessage("GAME OVER!");
		return;
	}

	// Display message when level is complete
	if (flagpole.isReached) {
		displayContinueMessage("LEVEL COMPLETE!");
		return;
	}

	// Handle enemy collision
	for (const enemy of enemies) {
		if (enemy.check(player_world_x, player_y)) {
			playerDied();
			return;
		}
	}

	// Play walking sound while moving.
	if ((isLeft || isRight) && !isFalling && !isPlummeting) {
		walk_sound.play();
	} else {
		walk_sound.stop();
	}

	// Logic to make the game character move or the background scroll.
	if (isLeft) {
		if (player_x > width * 0.35 || scroll_pos === 0) {
			player_x = max(player_x - 5, 20);
		} else {
			scroll_pos += 5;
		}
	}

	if (isRight) {
		if (player_x < width * 0.65) {
			player_x += 5;
		} else {
			scroll_pos -= 5; // negative for moving against the background
		}
	}

	// Don't allow scrolling beyond the beginning of the level
	scroll_pos = min(scroll_pos, 0);

	// Set player to falling if they're not on the ground and not on a platform
	const platform_standing_on = platforms.find((platform) => platform.check(player_world_x, player_y));

	if (player_y < floorPos_y) {
		isFalling = true;
	}

	if (platform_standing_on) {
		// Stop the player from falling while they're on a platform.
		player_y = platform_standing_on.position.y;
		isFalling = false;
	}

	// Logic to make the game character rise and fall.
	if (isFalling) {
		player_y = min(player_y + gravity, floorPos_y);

		if (player_y === floorPos_y) {
			isFalling = false;
		}
	}

	if (isPlummeting) {
		player_y += 7;
	}

	// Update real position of gameChar for collision detection.
	player_world_x = player_x - scroll_pos;

	checkPlayerDie();
}

// Display a large message in the middle of the screen and prompt the player to press space to continue.
function displayContinueMessage(str) {
	push();
	{
		fill(0);
		stroke(255);
		textAlign(CENTER, BOTTOM);
		textSize(70);
		strokeWeight(2);
		text(str, width / 2, height / 2);
		textAlign(CENTER, TOP);
		textSize(32);
		strokeWeight(1);
		text("Press space to continue...", width / 2, height / 2);
	}
	pop();
}

// Draw the player's remaining lives in the top left of the screen.
function drawLives() {
	push();
	{
		stroke(0);
		fill(230, 0, 0);
		for (let i = 0; i < lives; i++) {
			heart(30 + i * 55, 10, 40);
		}
	}
	pop();
}

// Draw the player's current score in the top left of the screen.
function drawScore() {
	push();
	{
		textAlign(LEFT, TOP);
		textSize(28);
		fill(255);
		stroke(0);
		text(`Score: ${game_score}`, 5, 60);
	}
	pop();
}

// Moves the flag down the pole depending on how long it's been since it was reached.
function getFlagHeightOffset() {
	const end = 0;
	const start = flagpole.pole_height - flagpole.flag_height - 3;
	const alpha = (game_time - flagpole.reached_time) / flagpole.flag_movement_speed;

	if (!flagpole.isReached) {
		// Flag hasn't been reached yet so it's in its starting position.
		return start;
	} else {
		// Flag has been reached and is sliding along the pole.
		return lerp(start, end, constrain(alpha, 0, 1));
	}
}

// Draw the flag pole. The height of the flag will differ if the player has reached the flag or not.
function renderFlagpole() {
	fill(...flagpole.pole_colour);
	rect(
		flagpole.x - flagpole.pole_width / 2,
		floorPos_y - flagpole.pole_height,
		flagpole.pole_width,
		flagpole.pole_height
	);

	// Get the current height of the flag, depending on if it's been reached and how long it's been since it was reached.
	const flag_height_offset = getFlagHeightOffset();

	// Draw the flag.
	fill(...flagpole.flag_colour);
	triangle(
		flagpole.x + flagpole.pole_width / 2 + 3,
		floorPos_y - flagpole.pole_height + flag_height_offset,
		flagpole.x + flagpole.pole_width / 2 + 3,
		floorPos_y - flagpole.pole_height + flagpole.flag_height + flag_height_offset,
		flagpole.x + flagpole.pole_width / 2 + 53,
		floorPos_y - flagpole.pole_height + flagpole.flag_height / 2 + flag_height_offset
	);
}

// Check if the player has reached the end of the level.
function checkFlagpole() {
	// Check if player has passed the flag's x position. This way the player only has to pass the flag rather than touch it.
	if (player_world_x >= flagpole.x - flagpole.pole_width / 2) {
		flag_sound.play();
		win_sound.play();
		flagpole.isReached = true;
		flagpole.reached_time = game_time;
		isLeft = false;
		isRight = false;
	}
}

// Handle player's death effects and restart the game if they have any remaining lives.
function playerDied() {
	die_sound.play();
	lives -= 1;

	// Check if player can respawn.
	if (lives >= 1) {
		startGame();
	} else {
		game_over_sound.play();
	}
}

// Check if the player is below the canvas (fallen into a canyon).
function checkPlayerDie() {
	if (player_y > height + 150) {
		playerDied();
	}
}

// ---------------------
// Key control functions
// ---------------------

// Handles input to move the player and restart the game.
function keyPressed() {
	// space key pressed
	if (keyCode === 32) {
		// Reset game after gameover or complete
		if (lives < 1 || flagpole.isReached) {
			lives = 3;
			game_over_sound.stop();
			win_sound.stop();
			startGame();
			return;
		}

		if (!isFalling && !isPlummeting) {
			// jump
			jump_sound.play();
			isFalling = true;
			player_y -= 100;
		}
	}

	// Don't register keypresses when the game isn't running
	if (lives < 1 || flagpole.isReached) return;

	if (key === "A") {
		isLeft = true;
	}

	if (key == "D") {
		isRight = true;
	}
}

// Handles left and right movement keys when released
function keyReleased() {
	if (key === "A") {
		isLeft = false;
	}

	if (key === "D") {
		isRight = false;
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
	for (let i = 0; i < clouds.length; i++) {
		const cloud = clouds[i];

		const x = cloud.x;
		const y = cloud.y;
		const width = cloud.width;
		const height = cloud.height;

		// Cloud was designed to be 200 pixels wide by 100 pixels tall, so scale based on that
		const x_scale = width / 200;
		const y_scale = height / 100;

		fill(240);
		arc(x, y, width, 60 * y_scale, PI, 0, CHORD);
		ellipse(x + -44 * x_scale, y - 35 * y_scale, 65 * x_scale, 65 * y_scale);
		ellipse(x + 20 * x_scale, y - 40 * y_scale, 80 * x_scale, 80 * y_scale);
		ellipse(x + 60 * x_scale, y - 20 * y_scale, 40 * x_scale, 40 * y_scale);
	}
}

// Function to draw mountains objects.
function drawMountains() {
	for (let i = 0; i < mountains.length; i++) {
		const mountain = mountains[i];

		const x = mountain.x;
		const y = mountain.y;
		const width = mountain.width;
		const height = mountain.height;

		// Mountain was designed to be 600 by 232 pixels in size, so scale based on that
		const x_scale = width / 600;
		const y_scale = height / 232;

		// Draw mountain
		fill(150);
		triangle(x, y, x + 345 * x_scale, y, x + 400 * x_scale, y - 232 * y_scale);
		fill(115);
		triangle(x + 345 * x_scale, y, x + 600 * x_scale, y, x + 400 * x_scale, y - 232 * y_scale);

		// Draw snowy peak
		fill(255);
		triangle(
			x + 400 * x_scale,
			y + -232 * y_scale,
			x + 458 * x_scale,
			y + -165 * y_scale,
			x + 376 * x_scale,
			y + -213 * y_scale
		);
		triangle(
			x + 400 * x_scale,
			y + -232 * y_scale,
			x + 422 * x_scale,
			y + -206 * y_scale,
			x + 313 * x_scale,
			y + -182 * y_scale
		);
		triangle(
			x + 364 * x_scale,
			y + -209 * y_scale,
			x + 387 * x_scale,
			y + -174 * y_scale,
			x + 420 * x_scale,
			y + -205 * y_scale
		);
	}
}

// Function to draw trees objects.
function drawTrees() {
	for (let i = 0; i < trees.length; i++) {
		const tree = trees[i];

		// If the tree needs to be drawn the other way then the x, y co-ordinates will need to be inverted.
		const x = tree.flipped ? -tree.x : tree.x;
		const y = tree.y;
		const tree_scale = tree.scale;

		push();
		{
			scale(tree.flipped ? -1 : 1, 1);

			// trunk
			fill(127, 59, 17);
			quad(
				x,
				y,
				x - 4 * tree_scale,
				y + -52 * tree_scale,
				x + 29 * tree_scale,
				y + -52 * tree_scale,
				x + 33 * tree_scale,
				y
			);

			// leaves
			fill(0, 100, 10);
			triangle(
				x + -60 * tree_scale,
				y + -32 * tree_scale,
				x + 87 * tree_scale,
				y + -37 * tree_scale,
				x + 7 * tree_scale,
				y + -107 * tree_scale
			);
			fill(0, 110, 10);
			triangle(
				x + -53 * tree_scale,
				y + -62 * tree_scale,
				x + 77 * tree_scale,
				y + -77 * tree_scale,
				x + -23 * tree_scale,
				y + -162 * tree_scale
			);
			fill(0, 128, 10);
			triangle(
				x + -53 * tree_scale,
				y + -97 * tree_scale,
				x + 47 * tree_scale,
				y + -127 * tree_scale,
				x + -43 * tree_scale,
				y + -192 * tree_scale
			);
		}
		pop();
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw all canyon objects.
function drawCanyons() {
	for (const canyon of canyons) {
		drawCanyon(canyon);
		checkCanyon(canyon);
	}
}

// Function to draw individual canyon objects
function drawCanyon(t_canyon) {
	const x = t_canyon.x;
	const water_y = height - 35;
	const width = t_canyon.width;

	push();
	{
		// Draw hole
		fill(0, 70, 10);
		rect(x, floorPos_y, width, 20);
		fill(61, 45, 31);
		rect(x, floorPos_y + 20, width, height - (floorPos_y - 20));
		fill(0, 40, 140);
		rect(x, water_y, width, height);

		// Draw round edges on grass
		fill(0, 155, 0);
		ellipse(x, floorPos_y + 10, 10, 20);
		ellipse(x + width, floorPos_y + 10, 10, 20);

		// Canyon's sign
		stroke(180);
		strokeWeight(5);
		line(x + width, height - (height - floorPos_y) / 1.7, x + width - 18, floorPos_y + 40);
		noStroke();
		fill(255, 255, 0);
		triangle(x + width - 32, floorPos_y + 26, x + width - 6, floorPos_y + 29, x + width - 20, floorPos_y + 61);
	}
	pop();
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon) {
	if (player_world_x > t_canyon.x + 5 && player_world_x < t_canyon.x + t_canyon.width - 5 && player_y >= floorPos_y) {
		isPlummeting = true;
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw all collectable objects.
function drawCollectables() {
	for (let i = 0; i < collectables.length; i++) {
		const collectable = collectables[i];
		if (collectable.isFound === false) {
			drawCollectable(collectable);
			checkCollectable(collectable);
		}
	}
}

function drawCollectable(t_collectable) {
	const x = t_collectable.x;
	const y = t_collectable.y;
	const size = t_collectable.size;

	push();
	{
		// Draw coin
		fill(255, 223, 0);
		strokeWeight(size / 50);
		stroke(212, 175, 0);
		ellipse(x, y, size);
		strokeWeight(size / 25);
		ellipse(x, y, size * 0.8);

		// Draw smiley face
		noStroke();
		fill(212, 182, 0);
		arc(x, y, size * 0.5, size * 0.5, 0, PI, CHORD);
		ellipse(x - size * 0.15, y - size * 0.15, size * 0.15);
		ellipse(x + size * 0.15, y - size * 0.15, size * 0.15);
	}
	pop();
}

// Function to check character has collected an item.
function checkCollectable(t_collectable) {
	// Get distance of player's head and feet from the collectable.
	const distance_feet = dist(player_world_x, player_y, t_collectable.x, t_collectable.y);
	const distance_head = dist(
		player_world_x + character.head.x_offset,
		player_y + character.head.y_offset - character.head.size / 2,
		t_collectable.x,
		t_collectable.y
	);

	// Compare the smallest distance to the collectable to see if it should be collected.
	if (min(distance_feet, distance_head) < t_collectable.size / 2) {
		coin_sound.play();
		t_collectable.isFound = true;
		game_score += 1;
	}
}

// ------------------------------------
// Functions used for graphical effects
// ------------------------------------

/* Displays a vertical gradient starting at position x, y and spanning width and height.
 * Colour1 is the starting colour, colour2 is the goal. Amount is the number of steps between colour 1 and colour 2.
 */
function gradient(x, y, width, height, colour1, colour2, amount = 10) {
	push();
	{
		const height_interval = height / amount;

		noStroke();
		for (let i = 0; i < amount; i++) {
			fill(lerpColor(colour1, colour2, i / amount));
			rect(x, y + i * height_interval, width, height_interval);
		}
	}
	pop();
}

// Translates the canvas by x, y and then calls a callback draw function.
function parallax(x, y, draw_func) {
	push();
	{
		translate(x, y);
		draw_func();
	}
	pop();
}

// ----------------------------------------
// Functions used for drawing custom shapes
// ----------------------------------------

// Draw a heart centered around the x, y position. Size is a bit of an estimate.
function heart(x, y, size) {
	beginShape();
	vertex(x, y);
	bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
	bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
	endShape(CLOSE);
}

// ---------------------------------
// Factory and Constructor functions
// ---------------------------------

// Create a platform that the player can stand on.
function createPlatform(position, length) {
	return {
		position: position,
		length: length,
		draw: function () {
			fill(122, 91, 61);
			rect(this.position.x, this.position.y + 5, length, 15, 5);
			fill(0, 155, 0);
			rect(this.position.x - 2, this.position.y, length + 4, 15, 5);
		},
		check: function (x, y) {
			if (x >= this.position.x && x <= this.position.x + this.length) {
				if (y <= this.position.y && y > this.position.y - gravity) {
					return true;
				}
			}
			return false;
		},
	};
}

// Create an enemy at a specified position that moves backwards and forwards. Kills player on collide.
function Enemy(position, range) {
	this.position = position;
	this.range = range;
	this.current_position = position.copy();
	this.increment = createVector(1, 0);
	this.radius = 20;

	// Update the robot's position and direction.
	this.update = function () {
		this.current_position.add(this.increment);

		if (this.position.dist(this.current_position) > this.range) {
			// Limit of range reached, flip direction.
			this.increment.mult(-1);
		}
	};

	// Draw the robot.
	this.draw = function () {
		image(
			this.increment.x > 0 ? enemy_right_image : enemy_left_image, // Robot should face the direction it's moving
			this.current_position.x - this.radius,
			this.current_position.y - this.radius * 3,
			this.radius * 2,
			this.radius * 3
		);
	};

	// Returns true if the given x, y co-ordinates are colliding with the robot.
	this.check = function (x, y) {
		return dist(x, y, this.current_position.x, this.current_position.y) <= this.radius;
	};
}
