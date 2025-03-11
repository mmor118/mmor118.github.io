let gunImage;
let showGun = false;
let gunTimer = 0;

function preload() {
  gunImage = loadImage("gun.png"); // Make sure to have gun.png in your project
}

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  
  // Setup Tone.js
  setupGunSound();
}

function draw() {
  background(50);
  
  // Display instructions
  fill(255);
  textSize(20);
  text("Click to fire!", width / 2, height - 30);
  
  // Show the gun image for a short duration
  if (showGun) {
    image(gunImage, width / 2 - 50, height / 2 - 50, 100, 100);
    if (millis() - gunTimer > 150) {
      showGun = false;
    }
  }
}

function mousePressed() {
  showGun = true;
  gunTimer = millis();
  triggerGunSound();
}

// Tone.js Sound Design
let noise, filter, osc, ampEnv, lfo;

function setupGunSound() {
  // White noise for explosion
  noise = new Tone.Noise("white").start();
  noise.volume.value = -10;

  // Low-pass filter for shaping
  filter = new Tone.Filter(800, "lowpass").toDestination();

  // Envelope for shaping noise volume
  ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.1,
    sustain: 0,
    release: 0.1
  }).connect(filter);

  // Connecting noise to envelope
  noise.connect(ampEnv);

  // Oscillator for the gun "bang"
  osc = new Tone.Oscillator(100, "square").start();
  osc.volume.value = -8;
  osc.connect(ampEnv);

  // LFO for dynamic modulation
  lfo = new Tone.LFO(20, 200, 800); // Modulating frequency
  lfo.connect(filter.frequency);
  lfo.start();
}

function triggerGunSound() {
  ampEnv.triggerAttackRelease(0.1);
}

