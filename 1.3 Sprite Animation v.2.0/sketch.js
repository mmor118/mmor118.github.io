let spelunkySprite;
let greenGirlSprite;
let characters = [];
const numCharacters = 6; 
const frameRateSpeed = 60; 
const movementSpeed = 2.5; 

function preload() {
  spelunkySprite = loadImage('SpelunkyGuy.png'); 
  greenGirlSprite = loadImage('GreenGirl.png'); 
}

function setup() {
  createCanvas(800, 400);
  for (let i = 0; i < numCharacters; i++) {
  
    let spriteChoice = random() < 0.5 ? spelunkySprite : greenGirlSprite;
    characters.push(new AnimatedCharacter(random(width), height - 80, spriteChoice));
  }
  frameRate(frameRateSpeed);
}

function draw() {
  background(220);

  let moveDirection = 0;
  if (keyIsDown(LEFT_ARROW)) {
    moveDirection = -1;
  } else if (keyIsDown(RIGHT_ARROW)) {
    moveDirection = 1;
  }

  for (let character of characters) {
    character.update(moveDirection);
    character.display();
  }
}

class AnimatedCharacter {
  constructor(x, y, spriteSheet) {
    this.x = x;
    this.y = y + 7; 
    this.spriteSheet = spriteSheet;
    this.frameIndex = 0;
    this.frameCounter = 0;
    this.direction = 1; 
    this.standingFrame = 0;
    this.walkFrames = [0, 1, 2, 3, 4]; 
  }

  update(moveDirection) {
    if (moveDirection !== 0) {
      this.direction = moveDirection;
      this.frameCounter++;

      if (this.frameCounter >= frameRateSpeed / 15) { 
        this.frameCounter = 0;
        this.frameIndex = (this.frameIndex + 1) % this.walkFrames.length;
      }

      this.x += moveDirection * movementSpeed;
    } else {
      this.frameIndex = 0; 
    }
  }

  display() {
    let frameX = this.walkFrames[this.frameIndex] * 80; 

    if (this.direction === 1) {
      image(this.spriteSheet, this.x, this.y, 80, 80, frameX, 0, 80, 80);
    } else {
      push();
      translate(this.x, this.y);
      scale(-1, 1);
      image(this.spriteSheet, -80, 0, 80, 80, frameX, 0, 80, 80);
      pop();
    }
  }
}
