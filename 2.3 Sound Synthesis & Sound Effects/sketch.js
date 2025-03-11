let gunImage;
let showGun = false;
let gunTimer = 0;

function preload() {
  gunImage = loadImage("gun.png"); // Ensure gun.png is in your project
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
  // Ensure Tone.js audio context is started
  Tone.start().then(() => {
    console.log("Tone.js audio context started!");
    triggerGunSound();
  }).catch((err) => {
    console.error("Error starting Tone.js:", err);
  });

  showGun = true;
  gunTimer = millis();
}

// Tone.js Sound Design
let noise, filter, osc, ampEnv, impactOsc, reverb, impactEnv, oscEnv;

function setupGunSound() {
  // White noise burst for the explosion
  noise = new Tone.Noise("white"); // No `.start()`, we trigger it dynamically
  noise.volume.value = -5;

  // Low-pass filter to shape the noise burst
  filter = new Tone.Filter(1000, "lowpass").toDestination();

  // Envelope to shape the noise burst
  ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.005, 
    decay: 0.1,
    sustain: 0,
    release: 0.05
  }).connect(filter);

  noise.connect(ampEnv);

  // Oscillator for deep gunshot thump
  impactOsc = new Tone.Oscillator(80, "sine"); // No `.start()`, triggered later
  impactOsc.volume.value = -10;

  impactEnv = new Tone.AmplitudeEnvelope({
    attack: 0.005,
    decay: 0.1,
    sustain: 0,
    release: 0.1
  }).toDestination();

  impactOsc.connect(impactEnv);

  // Higher-pitched oscillator for the sharp crack
  osc = new Tone.Oscillator({
    frequency: 1000,
    type: "sawtooth"
  });

  // Quick pitch drop for a realistic effect
  oscEnv = new Tone.FrequencyEnvelope({
    attack: 0.005,
    decay: 0.07,
    sustain: 0,
    release: 0.05,
    baseFrequency: 1000,
    octaves: -3
  });

  oscEnv.connect(osc.frequency);
  osc.connect(ampEnv);

  // Add reverb for realism
  reverb = new Tone.Reverb(0.4).toDestination();
  filter.connect(reverb);
}

function triggerGunSound() {
  // Start noise burst
  noise.start();
  ampEnv.triggerAttackRelease(0.1);

  // Start impact (bass thump)
  impactOsc.start();
  impactEnv.triggerAttackRelease(0.1);

  // Start crack (oscillator)
  osc.start();
  oscEnv.triggerAttackRelease(0.1);

  // Stop noise & oscillators after a short time (prevents unwanted continuous sound)
  setTimeout(() => {
    noise.stop();
    impactOsc.stop();
    osc.stop();
  }, 200);
}
