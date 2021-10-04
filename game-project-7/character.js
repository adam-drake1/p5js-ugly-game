/**
 * The code for drawing my character feels so long and unweildly that I've separated it into a different file.
 * I haven't had to edit this code for about 3 projects now so it's nice to move it out of the way so I can more
 * easily navigate my file.
 */

// Variables used when drawing the game character.
const character = {
	head: {
		x_offset: 0,
		y_offset: -65,
		size: 22,
	},
	eyes: {
		x_offset: 4,
		y_offset: -67,
	},
	body: {
		x_offset: 10,
		y_offset: -44,
		width: 20,
		height: 15,
	},
	shoulder: {
		x_offset: 0,
		y_offset: -44,
		width: 20,
		height: 20,
	},
	wheel: {
		x_offset: 0,
		y_offset: -1,
		width: 9,
		height: 9,
		jumping_y_offset: -11,
		jumping_x_offset: 10,
	},
	legs: {
		x_offset: 10,
		y_offset: -29,
	},
};

// Function to draw the game character.
function drawGameChar() {
	// Draw game character.
	if (isLeft && !isRight) {
		if (isFalling) {
			push();
			// rotate character around current point by 11 degrees
			translate(player_x, player_y);
			rotate(radians(-11));
			translate(-player_x, -player_y);

			// legs
			fill(10, 0, 40);
			triangle(
				player_x + character.body.x_offset,
				player_y + character.legs.y_offset,
				player_x - character.body.x_offset,
				player_y + character.legs.y_offset,
				player_x - 6,
				player_y - 16
			);
			triangle(
				player_x - 2,
				player_y - 22,
				player_x + 8,
				player_y + character.wheel.jumping_y_offset,
				player_x - 6,
				player_y - 16
			);
			fill(10, 0, 150);
			ellipse(
				player_x + character.body.x_offset,
				player_y + character.wheel.jumping_y_offset,
				character.wheel.width,
				character.wheel.height
			);

			// body
			fill(200, 0, 200);
			rect(
				player_x - character.body.x_offset,
				player_y + character.body.y_offset,
				character.body.width,
				character.body.height
			);
			ellipse(
				player_x + character.shoulder.x_offset,
				player_y + character.body.y_offset,
				character.shoulder.width,
				character.shoulder.height
			);

			// head
			fill(255, 215, 193);
			ellipse(player_x + character.head.x_offset, player_y + character.head.y_offset, character.head.size);
			stroke(0);
			strokeWeight(2);
			point(player_x - character.eyes.x_offset, player_y + character.eyes.y_offset);
			pop();
		} else {
			push();
			// rotate character by -11 degrees around current position
			translate(player_x, player_y);
			rotate(radians(-11));
			translate(-player_x, -player_y);

			// legs
			fill(20, 0, 75);
			triangle(
				player_x + character.wheel.x_offset,
				player_y + character.wheel.y_offset - 3,
				player_x - character.legs.x_offset,
				player_y + character.legs.y_offset,
				player_x + character.legs.x_offset,
				player_y + character.legs.y_offset
			);
			fill(10, 0, 150);
			ellipse(player_x, player_y + character.wheel.y_offset, character.wheel.width, character.wheel.height);

			// body
			fill(200, 0, 200);
			rect(
				player_x - character.body.x_offset,
				player_y + character.body.y_offset,
				character.body.width,
				character.body.height
			);
			ellipse(
				player_x + character.shoulder.x_offset,
				player_y + character.body.y_offset,
				character.shoulder.width,
				character.shoulder.height
			);

			// head
			fill(255, 215, 193);
			ellipse(player_x + character.head.x_offset, player_y + character.head.y_offset, character.head.size);
			stroke(0);
			strokeWeight(2);
			point(player_x - character.eyes.x_offset, player_y + character.eyes.y_offset);
			pop();
		}
	} else if (isRight && !isLeft) {
		if (isFalling) {
			// add your jumping-right code
			push();
			// rotate character by 11 degrees around current position
			translate(player_x, player_y);
			rotate(radians(11));
			translate(-player_x, -player_y);

			// legs
			fill(10, 0, 40);
			triangle(
				player_x - character.body.x_offset,
				player_y + character.legs.y_offset,
				player_x + character.body.x_offset,
				player_y + character.legs.y_offset,
				player_x + 6,
				player_y - 16
			);
			triangle(
				player_x + 2,
				player_y - 22,
				player_x - 8,
				player_y + character.wheel.jumping_y_offset,
				player_x + 6,
				player_y - 16
			);
			fill(10, 0, 150);
			ellipse(
				player_x - character.body.x_offset,
				player_y + character.wheel.jumping_y_offset,
				character.wheel.width,
				character.wheel.height
			);

			// body
			fill(200, 0, 200);
			rect(
				player_x - character.body.x_offset,
				player_y + character.body.y_offset,
				character.body.width,
				character.body.height
			);
			ellipse(
				player_x + character.shoulder.x_offset,
				player_y + character.body.y_offset,
				character.shoulder.width,
				character.shoulder.height
			);

			// head
			fill(255, 215, 193);
			ellipse(player_x + character.head.x_offset, player_y + character.head.y_offset, character.head.size);
			stroke(0);
			strokeWeight(2);
			point(player_x + character.eyes.x_offset, player_y + character.eyes.y_offset);
			pop();
		} else {
			push();
			// rotate character by 11 degrees around current position
			translate(player_x, player_y);
			rotate(radians(11));
			translate(-player_x, -player_y);

			// legs
			fill(20, 0, 75);
			triangle(
				player_x + character.wheel.x_offset,
				player_y + character.wheel.y_offset - 3,
				player_x - character.legs.x_offset,
				player_y + character.legs.y_offset,
				player_x + character.legs.x_offset,
				player_y + character.legs.y_offset
			);
			fill(10, 0, 150);
			ellipse(player_x, player_y + character.wheel.y_offset, character.wheel.width, character.wheel.height);

			// body
			fill(200, 0, 200);
			rect(
				player_x - character.body.x_offset,
				player_y + character.body.y_offset,
				character.body.width,
				character.body.height
			);
			ellipse(
				player_x + character.shoulder.x_offset,
				player_y + character.body.y_offset,
				character.shoulder.width,
				character.shoulder.height
			);

			// head
			fill(255, 215, 193);
			ellipse(player_x + character.head.x_offset, player_y + character.head.y_offset, character.head.size);
			stroke(0);
			strokeWeight(2);
			point(player_x + character.eyes.x_offset, player_y + character.eyes.y_offset);
			pop();
		}
	} else if (isFalling || isPlummeting) {
		// legs
		fill(10, 0, 150);
		ellipse(player_x, player_y + character.wheel.jumping_y_offset, character.wheel.width, character.wheel.height);
		fill(20, 0, 75);
		quad(
			player_x - character.legs.x_offset,
			player_y + character.legs.y_offset,
			player_x + character.legs.x_offset,
			player_y + character.legs.y_offset,
			player_x + 3,
			player_y + character.wheel.jumping_y_offset,
			player_x - 3,
			player_y + character.wheel.jumping_y_offset
		);

		// body
		fill(200, 0, 200);
		rect(
			player_x - character.body.x_offset,
			player_y + character.body.y_offset,
			character.body.width,
			character.body.height
		);
		ellipse(
			player_x + character.shoulder.x_offset,
			player_y + character.body.y_offset,
			character.shoulder.width,
			character.shoulder.height
		);

		// head
		fill(255, 215, 193);
		ellipse(player_x + character.head.x_offset, player_y + character.head.y_offset, character.head.size);
		stroke(0);
		strokeWeight(2);
		point(player_x - character.eyes.x_offset, player_y + character.eyes.y_offset);
		point(player_x + character.eyes.x_offset, player_y + character.eyes.y_offset);
	} else {
		// legs
		fill(20, 0, 75);
		triangle(
			player_x + character.wheel.x_offset,
			player_y + character.wheel.y_offset - 3,
			player_x - character.legs.x_offset,
			player_y + character.legs.y_offset,
			player_x + character.legs.x_offset,
			player_y + character.legs.y_offset
		);
		fill(10, 0, 150);
		ellipse(player_x, player_y + character.wheel.y_offset, character.wheel.width, character.wheel.height);

		// body
		fill(200, 0, 200);
		rect(
			player_x - character.body.x_offset,
			player_y + character.body.y_offset,
			character.body.width,
			character.body.height
		);
		ellipse(
			player_x + character.shoulder.x_offset,
			player_y + character.body.y_offset,
			character.shoulder.width,
			character.shoulder.height
		);

		// head
		fill(255, 215, 193);
		ellipse(player_x + character.head.x_offset, player_y + character.head.y_offset, character.head.size);
		stroke(0);
		strokeWeight(2);
		point(player_x - character.eyes.x_offset, player_y + character.eyes.y_offset);
		point(player_x + character.eyes.x_offset, player_y + character.eyes.y_offset);
	}
}
