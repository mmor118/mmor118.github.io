function setup() {
  createCanvas(150, 100);
  background(0, 255, 0); // Bright green background
}

function draw() {
   // Circle
  stroke(0); // Black outline
  fill(255); // White fill
  ellipse(40, 50, 50, 50); // Circle with diameter 50

  // Square
  rectMode(CENTER); // Set rectangle drawing from the center
  rect(105, 50, 50, 50); // Square with side 50
}
