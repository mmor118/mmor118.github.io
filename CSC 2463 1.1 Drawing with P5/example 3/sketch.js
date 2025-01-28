function setup() {
  createCanvas(400, 200);
  background(0); // Black background
}

function draw() {
  fill(255, 255, 0); // Yellow color
  noStroke();
  arc(100, 100, 100, 100, radians(225), radians(495), PIE); // Pac-Man facing left

  // Draw the ghost
  fill(255, 0, 0); // Red color
  noStroke();

  // Ghost's body (rounded top and straight bottom)
  arc(230, 100, 100, 100, radians(180), radians(0), CHORD); // Top rounded head
  rect(180, 100, 100, 50); // Bottom rectangular body

  // Ghost's eyes
  fill(255); // White for the eye background
  ellipse(210, 90, 25, 25); // Left eye
  ellipse(250, 90, 25, 25); // Right eye

  fill(0, 0, 255); // Blue for the pupils
  ellipse(210, 90, 15, 15); // Left pupil (centered)
  ellipse(250, 90, 15, 15); // Right pupil (centered)
}
