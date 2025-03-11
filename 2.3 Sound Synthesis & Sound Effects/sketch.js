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
  if (Tone.context.state !== 'running') {
    Tone.start();
    console.log("Audio context started");
  }

  showGun = true;
  gunTimer = millis();
  triggerGunSound();
}

// Tone.js Sound Design
let noise, filter, osc, ampEnv, lfo, impactOsc, reverb;

function setupGunSound() {
  // White noise burst for the explosion
  noise = new Tone.Noise("white").start();
  noise.volume.value = -5;

  // Low-pass filter to make the noise sound more punchy
  filter = new Tone.Filter(600, "lowpass").toDestination();

  // Amplitude envelope to shape the noise burst
  ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.005,  // Fast attack for a sharp burst
    decay: 0.1,     // Short decay for a quick bang
    sustain: 0,
    release: 0.05   // Quick fade-out
  }).connect(filter);

  noise.connect(ampEnv);

  // Oscillator for the gun "thump" (low bass kick)
  impactOsc = new Tone.Oscillator(80, "sine").start();
  impactOsc.volume.value = -10;

  // Envelope to make the impact have a quick thud
  let impactEnv = new Tone.AmplitudeEnvelope({
    attack: 0.005,
    decay: 0.1,
    sustain: 0,
    release: 0.1
  }).toDestination();
  
  impactOsc.connect(impactEnv);

  // LFO to add slight pitch modulation for realism
  lfo = new Tone.LFO(50, 500, 800); // Sweep the filter dynamically
  lfo.connect(filter.frequency);
  lfo.start();

  // Add reverb for realism
  reverb = new Tone.Reverb(0.5).toDestination();
  filter.connect(reverb);

  // Higher-frequency oscillator sweep for sharpness
  osc = new Tone.Oscillator({
    frequency: 1000,
    type: "sawtooth",
  }).start();

  // Quick frequency drop to simulate a crack sound
  let oscEnv = new Tone.FrequencyEnvelope({
    attack: 0.005,
    decay: 0.07,
    sustain: 0,
    release: 0.05,
    baseFrequency: 1000,
    octaves: -3
  });

  oscEnv.connect(osc.frequency);
  osc.connect(ampEnv);
}

function triggerGunSound() {
  ampEnv.triggerAttackRelease(0.1);
  impactOsc.triggerAttackRelease(0.1);
}
