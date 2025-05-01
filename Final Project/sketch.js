// === sketch.js ===
let scene = 'welcome';
let player;
let fruits = [];
let bombs = [];
let score = 0;
let lives = 3;
let startTime;
let gameDuration = 60;

let serial;
let latestJoystickX = 512;

// Tone.js sound setup
let synthFruit, synthBomb, musicSynth, chordSynth, drum;
let delay, backgroundLoop;
let toneStarted = false;

let fruitSheet;
let fruitSprites = [];
let bombImg, basketImg, backgroundImg, backgroundBuffer;

const GAME_WIDTH = 1380;
const GAME_HEIGHT = 920;

function preload() {
  fruitSheet = loadImage("fruit.png");

  bombImg = loadImage("bomb.png", 
    () => console.log("Bomb image loaded!"), 
    () => console.error("Bomb image failed to load."));

  basketImg = loadImage("basket.png", 
    () => console.log("Basket image loaded!"), 
    () => console.error("Basket image failed to load."));

  backgroundImg = loadImage("backgroundPic.jpg", 
    () => console.log("Background image loaded!"), 
    () => console.error("Background image failed to load."));
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  setupSerial();
  sliceFruits();
  player = new Player();

  if (backgroundImg) {
    backgroundBuffer = createGraphics(GAME_WIDTH, GAME_HEIGHT);
    backgroundBuffer.image(backgroundImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  }
}

function sliceFruits() {
  let w = Math.floor(fruitSheet.width / 4);
  let h = Math.floor(fruitSheet.height / 2);
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      let sprite = fruitSheet.get(col * w, row * h, w, h);
      fruitSprites.push(sprite);
    }
  }
}

function draw() {
  imageMode(CORNER);
  if (backgroundBuffer) {
    image(backgroundBuffer, 0, 0);
  } else {
    background(220);
  }

  fill(0);

  if (scene === 'welcome') {
    drawWelcome();
  } else if (scene === 'game') {
    drawGame();
  } else if (scene === 'gameOver') {
    drawGameOver();
  }
}

function drawWelcome() {
  textAlign(CENTER, CENTER);
  textSize(78);
  fill(0);
  text("🍓 Fruit Basket 🍌", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);
  textSize(32);
  text("Press any key to start", GAME_WIDTH / 2, GAME_HEIGHT / 2);
}

function drawGame() {
  fill(0);
  let elapsed = floor((millis() - startTime) / 1000);
  if (elapsed >= gameDuration || lives <= 0) {
    scene = 'gameOver';
    sendLivesToArduino(3);
    return;
  }

  textSize(32);
  text(`Time: ${gameDuration - elapsed}`, GAME_WIDTH - 200, 40);
  text(`Score: ${score}`, GAME_WIDTH - 200, 80);
  text(`Lives: ${lives}`, GAME_WIDTH - 200, 120);

  if (frameCount % 30 === 0) {
    if (random() < 0.8) {
      fruits.push(new Fruit(random(40, GAME_WIDTH - 40), -40, floor(random(8))));
    } else {
      bombs.push(new Bomb(random(40, GAME_WIDTH - 40), -40));
    }
  }

  player.update(map(latestJoystickX, 0, 1023, 0, GAME_WIDTH));
  player.display();

  for (let i = fruits.length - 1; i >= 0; i--) {
    let f = fruits[i];
    f.updateAndDraw();
    if (f.isCaught(player)) {
      score++;
      fruits.splice(i, 1);
      if (toneStarted) {try {
        synthFruit.triggerAttackRelease("C5", "8n");
      } catch (e) {
        console.warn("Fruit sound error:", e.message);
      }}
    } else if (f.isOffScreen()) {
      fruits.splice(i, 1);
    }
  }

  for (let i = bombs.length - 1; i >= 0; i--) {
    let b = bombs[i];
    b.updateAndDraw();
    if (b.isCaught(player)) {
      lives--;
      sendLivesToArduino(lives);
      bombs.splice(i, 1);
      if (toneStarted) synthBomb.triggerAttackRelease("C4", "8n");
    } else if (b.isOffScreen()) {
      bombs.splice(i, 1);
    }
  }
}

function drawGameOver() {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("💥 Game Over 💥", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);
  textSize(32);
  text(`Final Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2);
  text("Press any key to restart", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
}

function keyPressed() {
  if (scene === 'welcome') {
    startGame();
  } else if (scene === 'gameOver') {
    resetGame();
  }
}

function startGame() {
  score = 0;
  lives = 3;
  startTime = millis();
  fruits = [];
  bombs = [];
  scene = 'game';
  sendLivesToArduino(3);

  if (!toneStarted) {
    Tone.start().then(() => {
      setupTone();
      toneStarted = true;
    });
  }
}

function resetGame() {
  scene = 'welcome';
}

function setupTone() {
  Tone.Destination.volume.value = 0;
  delay = new Tone.FeedbackDelay("8n", 0.4).toDestination();
  synthFruit = new Tone.Synth().connect(delay);
  synthBomb = new Tone.MonoSynth().toDestination();

  const musicVol = new Tone.Volume(-45).toDestination();
  musicSynth = new Tone.Synth().connect(musicVol);
  chordSynth = new Tone.PolySynth().connect(musicVol);
  drum = new Tone.MembraneSynth().connect(musicVol);

  let measureCount = 0;
  backgroundLoop = new Tone.Loop(time => {
    const melodies = [
      ["C4", "E4", "G4", "B4", "A4", "F4", "D4", "G3"],
      ["E4", "G4", "B4", "C5", "A4", "F4", "D4", "E4"],
      ["D4", "F4", "A4", "B4", "G4", "E4", "C4", "D4"]
    ];
    const chords = [
      ["C4", "E4", "G4"],
      ["F4", "A4", "C5"],
      ["D4", "F4", "A4"],
      ["G3", "B3", "D4"]
    ];
    const melody = melodies[measureCount % melodies.length];
    const chord = chords[measureCount % chords.length];

    for (let i = 0; i < melody.length; i++) {
      musicSynth.triggerAttackRelease(melody[i], "8n", time + i * 0.25);
    }
    chordSynth.triggerAttackRelease(chord, "1n", time);
    drum.triggerAttackRelease("C2", "8n", time + 0.5);
    measureCount++;
  }, "2n");

  backgroundLoop.start(0);
  Tone.Transport.start();
}

class Player {
  constructor() {
    this.y = GAME_HEIGHT - 60;
    this.w = 250;
    this.h = 200;
    this.x = GAME_WIDTH / 2;
    this.hitboxWidth = this.w * 0.6;
    this.hitboxHeight = this.h * 0.6;
    this.speed = 9;
  }

  update(joystickX) {
    console.log("JoystickX:", joystickX);
    joystickX = parseFloat(joystickX);
    if (isNaN(joystickX)) return;

    const deadZoneMin = 470;
    const deadZoneMax = 700;

    if (joystickX < deadZoneMin) {
      this.x -= this.speed;
    } else if (joystickX > deadZoneMax) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, this.w / 2, GAME_WIDTH - this.w / 2);
  }

  display() {
    imageMode(CENTER);
    if (basketImg) {
      image(basketImg, this.x, this.y, this.w, this.h);
    } else {
      fill(0, 0, 255);
      rect(this.x, this.y, this.w, this.h);
    }
  }
}

class Fruit {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 70;
    this.speed = random(2, 4);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(0.01, 0.05);
  }

  updateAndDraw() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;

    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    imageMode(CENTER);
    image(fruitSprites[this.type], 0, 0, this.size, this.size);
    pop();
  }

  isCaught(player) {
    return (
      this.y + this.size / 2 > player.y - player.hitboxHeight / 2 &&
      this.y - this.size / 2 < player.y + player.hitboxHeight / 2 &&
      this.x > player.x - player.hitboxWidth / 2 &&
      this.x < player.x + player.hitboxWidth / 2
    );
  }

  isOffScreen() {
    return this.y > GAME_HEIGHT + this.size;
  }
}

class Bomb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 70;
    this.speed = random(2, 4);
  }

  updateAndDraw() {
    this.y += this.speed;
    imageMode(CENTER);
    if (bombImg) {
      image(bombImg, this.x, this.y, this.size, this.size);
    } else {
      fill(0);
      ellipse(this.x, this.y, this.size);
    }
  }

  isCaught(player) {
    return (
      this.y + this.size / 2 > player.y - player.h / 2 &&
      this.y - this.size / 2 < player.y + player.h / 2 &&
      this.x > player.x - player.w / 2 &&
      this.x < player.x + player.w / 2
    );
  }

  isOffScreen() {
    return this.y > GAME_HEIGHT + this.size;
  }
}

function setupSerial() {
  serial = new p5.SerialPort();
  serial.open('COM3');
  serial.on("data", () => {
    let data = serial.readLine().trim();
    if (!isNaN(data)) {
      latestJoystickX = int(data);
    }
  });
}

function sendLivesToArduino(l) {
  serial.write(`life:${l}\n`);
}
