function setup() {
  createCanvas(400, 400);
}

function draw() {
  noStroke();
  fill(255, 0, 0, 10); // Red with transparency
  ellipse(200, 120, 150);

  fill(0, 255, 0, 10); // Green with transparency
  ellipse(250, 200, 150);

  fill(0, 0, 255, 10); // Blue with transparency
  ellipse(150, 200, 150);
}
