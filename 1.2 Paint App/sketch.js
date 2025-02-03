let currentColor = 'black';
let brushSize = 5;

const paletteWidth = 60;
let paletteBoxes = [];

function setup() {
  createCanvas(800, 600);
  background(255);

  let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'];
  let boxSize = 30;
  let spacing = 10;

  for (let i = 0; i < colors.length; i++) {
    let box = {
      x: spacing,
      y: spacing + i * (boxSize + spacing),
      w: boxSize,
      h: boxSize,
      col: colors[i]
    };
    paletteBoxes.push(box);
  }

}

function draw() {
  push();
  strokeWeight(1); // Fixed border width
  stroke(0);       // Black border
  for (let box of paletteBoxes) {
    fill(box.col);
    rect(box.x, box.y, box.w, box.h);
  }
  pop();
}

function mouseDragged() {
  if (pmouseX > paletteWidth && mouseX > paletteWidth) {
    stroke(currentColor);
    strokeWeight(brushSize);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function mousePressed() {
  if (mouseX < paletteWidth) {
    for (let box of paletteBoxes) {
      if (
        mouseX >= box.x &&
        mouseX <= box.x + box.w &&
        mouseY >= box.y &&
        mouseY <= box.y + box.h
      ) {
        currentColor = box.col;
      }
    }
  }
}

function keyPressed() {
  if (key === '+' || key === '=') {
    brushSize += 2;
  } else if (key === '-' || key === '_') {
    brushSize = max(2, brushSize - 2);
  } 
  else if (key === 'c' || key === 'C') {
    background(255);
  }
}
