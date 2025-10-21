// Images used in this project is from
// https://pixabay.com/photos/rainbow-lorikeet-parrot-bird-7898675/
// https://www.pikpng.com/pngl/b/533-5337142_41-images-about-snapchat-filter-png-on-we.png
// https://w7.pngwing.com/pngs/201/241/png-transparent-emoji-clown-youtube-emoticon-pennywise-the-clown-smiley-smile-nose-thumbnail.png
// https://www.pngmart.com/files/23/Hand-Holding-Something-PNG-Transparent.png

// Global configuration TASK 2 & 3
const viewConfig = { width: 160, height: 120 };
let faceDetector;
let faceDetectorPattern = objectdetect.frontalface;
let frameCaptureBuffer;
let sourceImg;
let detectedFaces;

// UI Controls
let rSlider, gSlider, bSlider, BSslider;
let colorSpaceSlider;
let brightnessSlider;

// Interface elements
let imageUploader;
let currentFilterMode = 1;
let accessorySelector;
let animalEars;
let animalSnout;
let costumeAccessory1;
let costumeAccessory2;

// Load assets
function preload() {
  sourceImg = loadImage("assets/rainbow.jpg");
  animalEars = loadImage("assets/filterhead.png");
  animalSnout = loadImage("assets/filternose.png");
  costumeAccessory1 = loadImage("assets/clown.png");
  costumeAccessory2 = loadImage("assets/hand hold.png");
}

function setup() {
  // Create a large canvas for all visualizations
  createCanvas(750, 1000);
  pixelDensity(1);

  // Set up video inputs
  videoInput = createCapture(VIDEO);
  videoInput.size(viewConfig.width, viewConfig.height);
  videoInput.hide();

  secondaryVideo = createCapture(VIDEO);
  secondaryVideo.size(viewConfig.width, viewConfig.height);
  secondaryVideo.hide();

  // Initialize face detection
  const detectionThreshold = 1.2;
  faceDetector = new objectdetect.detector(viewConfig.width, viewConfig.height, detectionThreshold, faceDetectorPattern);
  frameCaptureBuffer = createImage(viewConfig.width, viewConfig.height);

  // Create file input for image uploads
  imageUploader = createFileInput(handleFileUpload);
  imageUploader.position(360, 40);

  // Create UI controls
  setupUIControls();
}

function draw() {
  // Clear and set background
  background(0, 128, 128);
  displayInstructions();

  if (sourceImg) {
    // Base image display
    renderBaseImage();
    createBrightenedGrayscale();

    // Channel displays
    extractRedComponent();
    extractGreenComponent();
    extractBlueComponent();

    // Thresholded displays
    thresholdRedChannel(rSlider.value());
    thresholdGreenChannel(gSlider.value());
    thresholdBlueChannel(bSlider.value());
    drawGreyscaleAndBrightnesswSlider(BSslider.value());
   
    // Color space transforms
    translate(-350, 150);
    renderBaseImage();
    displayConvertRGBtoCMYK();
    convertRGBtoYCbCr();

    // Advanced processing
    detectAndFilterFaces();
    thresholdCMYK();
    thresholdYCbCr();
  
    // AR features
    applyFaceAccessories();
  }
}

// Handle keyboard shortcuts for filter selection
function keyPressed() {
  if (key >= '1' && key <= '4') {
    currentFilterMode = parseInt(key);
    const filterNames = ['', 'Greyscale', 'Blurred', 'CMYK', 'Pixelated'];
    console.log(`Switched to ${filterNames[currentFilterMode]} filter`);
  }
}

// Take a snapshot from camera
function takeSnapshot() {
  sourceImg = createImage(viewConfig.width, viewConfig.height);
  sourceImg.copy(videoInput, 0, 0, videoInput.width, videoInput.height, 0, 0, viewConfig.width, viewConfig.height);
  redraw();
  console.log("Image captured from camera");
}

// Process uploaded files
function handleFileUpload(file) {
  if (file.type === "image") {
    loadImage(file.data, function(newImage) {
      sourceImg = newImage;
      redraw();
      console.log("Image loaded successfully: ", file.name);
    });
  } else {
    console.error("Unsupported file format: ", file.type);
  }
}

// Create and position UI elements
function setupUIControls() {
  // RGB adjustment sliders
  rSlider = createSlider(0, 256, 125);
  rSlider.position(30, viewConfig.height*3 + 45);
  
  gSlider = createSlider(0, 256, 125);
  gSlider.position(viewConfig.width + 43, viewConfig.height*3 + 45);
  
  bSlider = createSlider(0, 256, 125);
  bSlider.position(viewConfig.width*2 + 53, viewConfig.height*3 + 45);

  BSslider = createSlider(0, 200, 100);
  BSslider.position(viewConfig.width*3 + 63, viewConfig.height*3 + 45);

  // Advanced processing controls
  colorSpaceSlider = createSlider(0, 256, 125);
  colorSpaceSlider.position(viewConfig.width + 40, viewConfig.height*5 + 112);
  
  brightnessSlider = createSlider(0, 128, 64);
  brightnessSlider.position(viewConfig.width*2 + 50, viewConfig.height*5 + 112);
  
  // Camera snapshot button
  let cameraButton = createButton("Take Snapshot using webcam");
  cameraButton.position(360, 70);
  cameraButton.mousePressed(takeSnapshot);

  // AR accessory selector
  accessorySelector = createSelect();
  accessorySelector.position(viewConfig.width + 35, viewConfig.height*7 + 100);
  accessorySelector.option('Animal');
  accessorySelector.option('Costume');
  accessorySelector.changed(handleAccessoryChange);
}

// Show help text for keyboard shortcuts
function displayInstructions() {
  textSize(15);
  fill(0);
  
  text("Filter Selection Keys:", 10, 703);
  text("Press a number key:", 10, 723);

  fill(0);
  noStroke(0);
  
  text("1: Greyscale", 10, 748);
  text("2: Blurred", 10, 768);
  text("3: CMYK", 10, 788);
  text("4: Pixelated", 10, 808);
}

// Handle accessory type changes
function handleAccessoryChange() {
  let selected = accessorySelector.value();
  console.log('Accessory changed to:', selected);
}

// Optimize canvas performance for pixel manipulation
const originalCanvasContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(contextType, contextOptions = {}) {
  contextOptions.willReadFrequently = true;
  return originalCanvasContext.call(this, contextType, contextOptions);
};