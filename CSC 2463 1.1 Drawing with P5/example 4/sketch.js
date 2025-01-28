function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(10, 15, 100); // Deep blue background

  // Green circle
  fill(0, 150, 0);
  noStroke();
  circle(width / 2, height / 2, 250);

  // White outline for the circle
  stroke(255);
  strokeWeight(5);
  noFill();
  circle(width / 2, height / 2, 250);

  // Red star
  noStroke();
  fill(200, 0, 0);
  drawStar(width / 2, height / 2, 60, 130, 5);

// Red star with white outline
stroke(255); // White outline
strokeWeight(5);
fill(200, 0, 0); // Red color
drawStar(width / 2, height / 2, 60, 130, 5);
}
// Function to draw a star
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}