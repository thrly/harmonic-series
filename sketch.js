let osc1, osc2, osc3, playing, freq, amp, delay, reverb;
let fundamentalSlider, slider, startButton, randomButton, resetButton, fullscreenButton, saveCSVbutton, wanderButton, wanderSpeed;

let oscCount = 21;
let allOscs = [];
let allAmps = [];

let audioToggle = 0;
let fullscreenToggle = 0;
let wanderToggle = 0;

function setup() {
  getAudioContext().suspend();
  createCanvas(windowWidth, windowHeight);
  let vSpace = height / oscCount;

  for (let i = 0; i < oscCount; i++) {
    let osc = new p5.Oscillator();

    let slider = createSlider(0, 0.95, 0.8 - 1 * (i * 0.06), 0.01); 
    //slider.position(10, windowHeight - (height/oscCount * i));
    slider.position(10, windowHeight -(windowHeight/(oscCount-0.2) * i));

    slider.size(190);
    allAmps.push(slider)
    
    osc.setType("sine");
    osc.freq(freq * i);
    osc.start();
    osc.pan(random(-1,1)*(i/oscCount));
    allOscs.push(osc);
  }
  fundamentalSlider = createSlider(0, 220, 55, 0.01);
  wanderSpeed = createSlider(0,1,0.05,0.0001)
  
  startButton = createButton("play");
  startButton.position(width-(width*0.1), 65);
  startButton.mousePressed(togglePlaying);
  
  randomButton = createButton("randomise");
  randomButton.position(width-(width*0.1), 95);
  randomButton.mousePressed(randomise);
  
  resetButton = createButton("clear");
  resetButton.position(width-(width*0.1), 125);
  resetButton.mousePressed(reset);
  
  // fullscreenButton = createButton("fullscreen");
  // fullscreenButton.position(width-(width*0.1), 155);
  // fullscreenButton.mousePressed(fullscreenMode);
  
  wanderButton = createButton("wander");
  wanderButton.position(width-(width*0.1), 155);
  wanderButton.mousePressed(wander);
  
  saveCSVbutton = createButton("save CSV");
  saveCSVbutton.position(width-100, height-80);
  saveCSVbutton.mousePressed(dumpout);
  

}

function draw() {
  background(235);
  freq = fundamentalSlider.value();
  noStroke();
  
  fundamentalSlider.position(width-180, 10);
  fundamentalSlider.size(150);
  wanderSpeed.position(width-180, 35);
  wanderSpeed.size(150);
  
  for (let i = 0; i < oscCount; i++) {
    allOscs[i].freq(freq * i);
    allOscs[i].amp(allAmps[i].value());
    noStroke();
    
    if(wanderToggle === true){
      let noiseVal = noise(frameCount*(wanderSpeed.value()*0.005), i);
      allAmps[i].value(noiseVal);
    }

    let drawY = map(allOscs[i].f, freq, freq * oscCount, height-oscCount, 0);
    let gradient = map(i, 0, oscCount, 0, 127);
    
    // draw lines and circles
    stroke(255 - gradient, 0, 255, 50);
    line(210, drawY, width, drawY);
    for (let x = 220; x < width; x += 25) {
      push();
      noStroke();
      fill(255 - gradient, 0, 255, 127 * allAmps[i].value());
      ellipse(x, drawY, 30 * allAmps[i].value(), 30 * allAmps[i].value());
      pop();
    }
  }
  
  // text
  for (let i = 1; i < oscCount; i++) {
      let drawY = map(allOscs[i].f, freq, freq * oscCount, height-oscCount, 0);
      push();
      noStroke();
      fill(0);
      text("f"+i+": "+freq * i+" Hz", 210, drawY-10);

    }
  text("freq: " + freq + " Hz", width-280, 25);
  text("wander: " + wanderSpeed.value(), width-280, 50);
  // text("F = fullscreen\nR = randomise", width-100, height-35);
  text("~ o thurley, 2024", width-120, height-35);

  pop();
}

// Resize the canvas when the browser's size changes.
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
  
//   startButton.position(width-(width*0.1), 65);
//   randomButton.position(width-(width*0.1), 95);
//   resetButton.position(width-(width*0.1), 125);
//   // fullscreenButton.position(width-(width*0.1), 155);
//   wanderButton.position(width-(width*0.1), 185);
//   saveCSVbutton.position(width-(width*0.1), height-80);
// }

// If the mouse is pressed toggle full-screen mode.
function keyPressed() {
  // if (key === 'f') {
  //   let fs = fullscreen();
  //   fullscreen(!fs);
  // }
  if (key === 'r') {
    // randomise amplitudes
    for(let r = 0; r < oscCount;r++){
      allAmps[r].value(random(0,1));
    }
    wanderToggle = 0;
  }
}

function togglePlaying(){
  if(audioToggle === 0){
        userStartAudio();
        audioToggle = 1;
        startButton.html('stop');
      }
      else {
        getAudioContext().suspend();
        audioToggle = 0;
        startButton.html('play');
      }
}
function randomise(){
  for(let r = 0; r < oscCount;r++){
      allAmps[r].value(random(0,0.9));
    }
  wanderToggle = 0;
  wanderButton.html('wander');
}
function reset(){
  for(let r = 0; r < oscCount;r++){
      allAmps[r].value(0);
    }
}

function wander(){
  if(wanderToggle === false){
        wanderToggle = true;
        wanderButton.html('static');
      }
  else {
    wanderToggle = false;
    wanderButton.html('wander');
    }
}

//toggle fullscreen mode
// function fullscreenMode(){
//   if(fullscreenToggle === 0){
//         let fs = fullscreen();
//         fullscreen(true);
//         fullscreenToggle = 1;
//         fullscreenButton.html('exit');
//       }
//     else {
//         fullscreenToggle = 0;
//         fullscreen(false);
//         fullscreenButton.html('fullscreen');
//       }
// }

function dumpout(){ // write out to a csv
  let table = new p5.Table();
  table.addColumn('partial'); 
  table.addColumn('freq (Hz)');
  table.addColumn('gain');
  for(let r = 1; r < oscCount;r++){
      let newRow = table.addRow();
      newRow.set('partial',r);
      newRow.set('freq (Hz)',freq * r);
      newRow.set('gain',allAmps[r].value());
    }
  save(table, "harmonics_list.csv");
}

// lot of help from this page: https://creative-coding.decontextualize.com/synthesizing-analyzing-sound/
