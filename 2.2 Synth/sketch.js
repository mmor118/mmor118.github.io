let synth;
let filter;
let reverb;
let octave = 4;
let keyMap;
let activeKeys = {};
let reverbSlider;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  filter = new Tone.Filter(1000, "lowpass").toDestination();
  reverb = new Tone.Reverb(2).toDestination(); // Reverb effect with 2 sec decay
  synth.connect(filter);
  synth.connect(reverb);
  
  keyMap = {
    'A': 'C', 'W': 'C#', 'S': 'D', 'E': 'D#', 'D': 'E', 'F': 'F', 'T': 'F#',
    'G': 'G', 'Y': 'G#', 'H': 'A', 'U': 'A#', 'J': 'B', 'K': 'C'
  };
  
  reverbSlider = createSlider(0, 1, 0.5, 0.01); // Control reverb wetness
  reverbSlider.position(20, height - 50);
}

function draw() {
  background(30);
  fill(255);
  textSize(20);
  text("Web Synthesizer", width / 2, 30);
  text("Press keyboard keys to play notes", width / 2, 60);
  text("Use Z/X to shift octaves", width / 2, 90);
  text("Reverb Mix:", 100, height - 70);
  text(reverbSlider.value(), 200, height - 70);
  
  reverb.wet.value = reverbSlider.value(); // Update reverb mix
  
  drawKeyboard();
}

function drawKeyboard() {
  let x = 50;
  let y = height / 2;
  let whiteKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'];
  let blackKeys = ['W', 'E', 'T', 'Y', 'U'];
  
  for (let key of whiteKeys) {
    fill(activeKeys[key] ? 'yellow' : 'white');
    rect(x, y, 40, 100);
    fill(0);
    text(key, x + 20, y + 80);
    x += 50;
  }
  
  x = 80;
  for (let key of blackKeys) {
    fill(activeKeys[key] ? 'yellow' : 'black');
    rect(x, y, 30, 60);
    fill(255);
    text(key, x + 15, y + 40);
    x += (key === 'E' || key === 'U') ? 100 : 50;
  }
}

function keyPressed() {
  let k = key.toUpperCase();
  if (k in keyMap) {
    let note = keyMap[k] + octave;
    synth.triggerAttack(note);
    activeKeys[k] = true;
  } else if (k === 'Z') {
    octave = max(1, octave - 1);
  } else if (k === 'X') {
    octave = min(6, octave + 1);
  }
}

function keyReleased() {
  let k = key.toUpperCase();
  if (k in keyMap) {
    let note = keyMap[k] + octave;
    synth.triggerRelease(note);
    activeKeys[k] = false;
  }
}

// Ensure Tone.js starts only after a user interaction
document.addEventListener("click", async () => {
  await Tone.start();
  console.log("Tone.js started");
});
