let bugs = [];
let squishedCount = 0;
let timer = 30;
let bugSprite;
let grassBackground;
let gameRunning = true;
let squishSound, missSound, bgMusic;
let restartButton;
let gameTimer; // Stores interval so we can clear it

function preload() {
  bugSprite = loadImage("BugSprite.png");
  grassBackground = loadImage("GrassSquare.png");
  squishSound = loadSound("squish.mp3");
  missSound = loadSound("miss.mp3");
  bgMusic = loadSound("background.mp3");
}

function setup() {
  createCanvas(600, 400);
  startGame();
}

function startGame() {
  gameRunning = true;
  squishedCount = 0;
  timer = 30;
  bugs = [];
  
  for (let i = 0; i < 5; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }

  // Start background music at 10% volume and normal speed
  bgMusic.setVolume(0.1);
  bgMusic.rate(1.0);
  bgMusic.loop();

  // Remove restart button if it exists
  if (restartButton) {
    restartButton.remove();
    restartButton = null;
  }

  // Clear previous timer
  if (gameTimer) {
    clearInterval(gameTimer);
  }

  // Start countdown timer
  gameTimer = setInterval(() => {
    if (timer > 0) {
      timer--;

      // Gradually increase background music speed from 1.0 to 1.5x over 30 seconds
      let speedMultiplier = map(timer, 30, 0, 1.0, 1.8);
      bgMusic.rate(speedMultiplier);

    } else {
      clearInterval(gameTimer); // Stop timer when game ends
      gameRunning = false;
      bgMusic.stop();
      showRestartButton();
    }
  }, 1000);
}

function draw() {
  background(grassBackground);
  
  let speedMultiplier = map(timer, 30, 0, 1, 3); 
  if (gameRunning) {
    for (let bug of bugs) {
      bug.update(speedMultiplier);
      bug.show();
    }
    
    // Keep the "Squished" counter fixed
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Squished: " + squishedCount, 20, 20);
    text("Time: " + timer, width - 100, 20);
  } else {
    // Centered Game Over text
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2 - 20);
    text("Final Score: " + squishedCount, width / 2, height / 2 + 20);
  }
}

function mousePressed() {
  let bugSquished = false;
  
  for (let bug of bugs) {
    if (!bug.squished && bug.isClicked(mouseX, mouseY)) {
      bug.squish();
      squishedCount++;
      squishSound.setVolume(0.3); // Lower squish sound volume to 50%
      squishSound.play();
      bugs.push(new Bug(random(width), random(height))); 
      bugSquished = true;
    }
  }

  if (!bugSquished) {
    missSound.setVolume(0.3); // Lower miss sound volume to 50%
    missSound.play();
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
    rotate(this.dir.heading() + PI / 2); 
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

// Display restart button when game ends
function showRestartButton() {
  restartButton = createButton("Restart Game");
  
  // Center the button on screen
  restartButton.position(width / 2 - 80, height / 2 + 50);
  
  // Modern button styling
  restartButton.style("background-color", "#4CAF50");
  restartButton.style("color", "white");
  restartButton.style("border", "none");
  restartButton.style("padding", "10px 20px");
  restartButton.style("font-size", "18px");
  restartButton.style("border-radius", "5px");
  restartButton.style("cursor", "pointer");

  restartButton.mousePressed(() => {
    restartButton.remove(); // Ensure button disappears
    restartButton = null; // Set to null to avoid issues
    startGame(); // Restart the game
  });
}
