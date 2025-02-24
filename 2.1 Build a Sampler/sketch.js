let buttons = [];
let volumeSliders = [];
let filterSliders = [];
let filters = [];
let samples = [];
let labels = ["Drums", "Guitar", "Piano", "Bass"];

function preload() {
  soundFormats('mp3', 'wav');
}

function setup() {
  createCanvas(500, 350); 
  userStartAudio(); 

  textAlign(CENTER, CENTER);

  for (let i = 0; i < 4; i++) {
    let y = 70 + i * 70; 

    
    filters[i] = new p5.Filter('lowpass');

    
    buttons[i] = createButton(labels[i]); 
    buttons[i].position(50, y);
    buttons[i].size(100, 40); 
    buttons[i].mousePressed(() => loadAndPlaySample(i));

 
    volumeSliders[i] = createSlider(0, 1, 0.5, 0.01);
    volumeSliders[i].position(200, y + 10);

   
    filterSliders[i] = createSlider(200, 22050, 22050, 10);
    filterSliders[i].position(350, y + 10);

    samples[i] = null; 
  }
}

function loadAndPlaySample(index) {
  
  if (samples[index]) {
    samples[index].stop();
    samples[index].disconnect();
    samples[index] = null;
  }

  
  samples[index] = loadSound(`sounds/sample${index + 1}.mp3`, () => {
    playSample(index);
  });
}

function playSample(index) {
  let sample = samples[index];

  if (!sample.isLoaded()) {
    console.error(`Sample ${index + 1} failed to load.`);
    return;
  }

  
  sample.disconnect();
  sample.connect(filters[index]);
  sample.setVolume(volumeSliders[index].value());
  sample.play();

  
  applyFilter(index);
  applyVolume(index);

  
  sample.onended(() => {
    samples[index] = null;
  });
}

function applyFilter(index) {
  if (!samples[index]) return;
  let filterFreq = filterSliders[index].value();
  filters[index].freq(filterFreq);
}

function applyVolume(index) {
  if (!samples[index]) return;
  let volume = volumeSliders[index].value();
  samples[index].setVolume(volume);
}

function draw() {
  background(150); 
  textSize(24);
  fill(255);
  textStyle(BOLD);
  
  
  text('Audio Sampler', width / 2, 30);

  textSize(14);
  textStyle(NORMAL);
  text('Play/Pause', 100, 50);
  text('Volume', 250, 50);
  text('Low-Pass Filter', 400, 50);

 
  for (let i = 0; i < 4; i++) {
    if (samples[i] && samples[i].isPlaying()) {
      applyFilter(i);
      applyVolume(i);
    }
  }
}
