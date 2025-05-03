
let notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
let colorButtons = [];
let currentColor;
let globalReverb;
let activeOscillators = [];

function setup() {
  userStartAudio();
  createCanvas(windowWidth, windowHeight);
  background(0);
  noFill();
  strokeWeight(2);
  createColorButtons();
  globalReverb = new p5.Reverb(); // 리버브 하나만 생성
}

function draw() {
  if (mouseIsPressed && mouseY > 50) {
    stroke(currentColor);
    line(pmouseX, pmouseY, mouseX, mouseY);
    playNote(mouseY);
  }
}

function createColorButtons() {
  let colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFC75F", "#B28DFF"];
  let container = select("#colorContainer");
  colors.forEach((c) => {
    let btn = createButton("");
    btn.style("background-color", c);
    btn.class("color-button");
    btn.mousePressed(() => currentColor = c);
    btn.parent(container);
    colorButtons.push(btn);
  });
  currentColor = colors[0];
}

function playNote(yPos) {
  let freqIndex = floor(map(yPos, 0, height, 0, notes.length));
  freqIndex = constrain(freqIndex, 0, notes.length - 1);
  let freq = notes[notes.length - 1 - freqIndex];

  let osc = new p5.Oscillator("sine");
  osc.freq(freq);
  osc.amp(0.06, 0.1);
  osc.start();

  globalReverb.process(osc, 3, 2);
  osc.stop(2.5); // 사운드 길이 조정

  activeOscillators.push(osc);
  if (activeOscillators.length > 10) {
    let old = activeOscillators.shift();
    old.dispose(); // 오래된 오실레이터 해제
  }
}
