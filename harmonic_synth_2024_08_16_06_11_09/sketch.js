let osc1, osc2, osc3, playing, freq, amp, delay, reverb;
let fundamentalSlider, slider2;

let oscCount = 21;
let allOscs = [];
let allAmps = [];

function setup() {
  let cnv = createCanvas(500, 500);

  for (let i = 0; i < oscCount; i++) {
    let osc = new p5.Oscillator();
    let ampSlide = createSlider(0, 1, 0.8 - 1 * (i * 0.06), 0.01);
    osc.setType("sine");
    osc.freq(freq * i);
    // scale amplitude to number of oscillators
    osc.amp(1.0 / oscCount);
    osc.start();
    allOscs.push(osc);
    allAmps.push(ampSlide);
  }

  fundamentalSlider = createSlider(55, 220, 0, 0.01);

  //reverb = new p5.Reverb();
}

function draw() {
  background(220);

  freq = fundamentalSlider.value();
  noStroke();
  text("freq: " + freq + " Hz", 20, 40);

  fundamentalSlider.position(100, 25);
  fundamentalSlider.size(200);

  for (let i = 0; i < oscCount; i++) {
    allOscs[i].freq(freq * i);
    allOscs[i].amp(allAmps[i].value());

    let drawY = map(allOscs[i].f, freq, freq * oscCount, height, 0);
    //strokeWeight(2);
    let gradient = map(i, 0, oscCount, 0, 127);
    stroke(255 - gradient, 0, 255, 255 * allAmps[i].value());
    line(0, drawY, width, drawY);
    for (let i = 0; i < width; i += 8) {
      ellipse(i, drawY + sin(i * freq), 5, 5);
    }
    //reverb.process(allOscs[i],6, 0.2);
  }
}

// lot of help from this page: https://creative-coding.decontextualize.com/synthesizing-analyzing-sound/
