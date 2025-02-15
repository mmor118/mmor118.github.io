let bugs = [];
let squishedCount = 0;
let timer = 30;
let bugSprite;
let grassBackground;
let gameRunning = true;

function preload() {
  bugSprite = loadImage("BugSprite.png");
  grassBackground = loadImage("GrassSquare.png");
}

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 5; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }
  setInterval(() => {
    if (timer > 0) {
      timer--;
    } else {
      gameRunning = false;
    }
  }, 1000);
}

function draw() {
  background(grassBackground);
  
  let speedMultiplier = map(timer, 30, 0, 1, 3); // Speed increases dynamically as time decreases

  if (gameRunning) {
    for (let bug of bugs) {
      bug.update(speedMultiplier);
      bug.show();
    }
    
    fill(0);
    textSize(20);
    text("Squished: " + squishedCount, 20, 30);
    text("Time: " + timer, width - 100, 30);
  } else {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2);
    text("Final Score: " + squishedCount, width / 2, height / 2 + 40);
  }
}

function mousePressed() {
  for (let bug of bugs) {
    if (!bug.squished && bug.isClicked(mouseX, mouseY)) {
      bug.squish();
      squishedCount++;
      bugs.push(new Bug(random(width), random(height))); // New bug without predefined speed
    }
  }
}

class Bug {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.dir = p5.Vector.random2D();
    this.squished = false;
    this.squishTime = 0;
    this.spriteWidth = bugSprite.width;
    this.spriteHeight = bugSprite.height / 3;
  }
  
  update(speedMultiplier) {
    if (!this.squished) {
      this.x += this.dir.x * this.speed * speedMultiplier;
      this.y += this.dir.y * this.speed * speedMultiplier;
      
      if (this.x < 0 || this.x > width) this.dir.x *= -1;
      if (this.y < 0 || this.y > height) this.dir.y *= -1;
    }
    
    if (this.squished && millis() - this.squishTime > 3000) {
      let index = bugs.indexOf(this);
      if (index > -1) bugs.splice(index, 1);
    }
  }
  
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.dir.heading() + PI / 2); // Adjust rotation to make bugs face movement direction correctly
    imageMode(CENTER);
    
    if (this.squished) {
      image(bugSprite, 0, 0, this.spriteWidth, this.spriteHeight, 0, this.spriteHeight * 2, this.spriteWidth, this.spriteHeight);
    } else {
      let frame = floor(millis() / 200) % 2;
      image(bugSprite, 0, 0, this.spriteWidth, this.spriteHeight, 0, frame * this.spriteHeight, this.spriteWidth, this.spriteHeight);
    }
    pop();
  }
  
  isClicked(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.spriteWidth / 4;
  }
  
  squish() {
    this.squished = true;
    this.squishTime = millis();
  }
}
