function setup() {
  createCanvas(180, 100);
  
}

function draw() {
  background(0, 255, 0); // Bright green background
  stroke(0); // Black outline
  fill(255); // White fill
  ellipse(50, 50, 50, 50); // Circle with diameter 50

  // Square
  rectMode(CENTER); // Set rectangle drawing from the center
  rect(120, 50, 50, 50); // Square with side 50
}
