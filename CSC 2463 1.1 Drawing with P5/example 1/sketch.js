function setup() {
  createCanvas(180, 200);
  
}

function draw() {
  // Top section: Green background with circle and square
  background(0, 255, 0); // Bright green background
  stroke(0); // Black outline
  fill(255); // White fill
  ellipse(50, 50, 50, 50); // Circle with diameter 50
  rectMode(CENTER); // Set rectangle drawing from the center
  rect(120, 50, 50, 50); // Square with side 50

  // Bottom section: Overlapping colored circles
  // Draw the overlapping circles below the first part
  noStroke();
  fill(255, 0, 0, 150); // Red with transparency
  ellipse(90, 150, 60, 60);
  
  fill(0, 255, 0, 150); // Green with transparency
  ellipse(120, 150, 60, 60);
  
  fill(0, 0, 255, 150); // Blue with transparency
  ellipse(105, 130, 60, 60);
}
