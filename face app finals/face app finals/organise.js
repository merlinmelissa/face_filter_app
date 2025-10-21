// Image loaded from webcam TASK 1
function renderBaseImage() {
  image(sourceImg, 10, 10);
  sourceImg.resize(viewConfig.width, viewConfig.height);
}

// Helper for pixel manipulation
function getPixelData(img, posX, posY) {
  const pixelPosition = ((img.width * posY) + posX) * 4;
  return {
    position: pixelPosition,
    r: img.pixels[pixelPosition],
    g: img.pixels[pixelPosition + 1],
    b: img.pixels[pixelPosition + 2]
  };
}

// GRAYSCALE PROCESSING TASK 4
function createBrightenedGrayscale() {
  translate(viewConfig.width + 20, 10);
  let grayImage = sourceImg.get();
  grayImage.loadPixels();

  // Process each pixel
  for (let y = 0; y < grayImage.height; y++) {
    for (let x = 0; x < grayImage.width; x++) {
      const {position, r, g, b} = getPixelData(grayImage, x, y);
      
      // Brightness increase to 20%
      const brightnessFactor = 1.2;
      // Greyscale conversion
      const grayValue = ((r + g + b) / 3) * brightnessFactor;
      // Not exceeding 255 pixel intensity TASK 5
      const safeValue = constrain(grayValue, 0, 255);
      
      // Set all RGB channels to the same value
      grayImage.pixels[position] = safeValue;
      grayImage.pixels[position + 1] = safeValue;
      grayImage.pixels[position + 2] = safeValue;
    }
  }

  grayImage.updatePixels();
  image(grayImage, 0, 0);
  grayImage.resize(viewConfig.width, viewConfig.height);
}

// SPLITTING IMAGES INTO THREE CHANNELS TASK 6
function extractRedComponent() {
  translate(-viewConfig.width - 10, viewConfig.height + 10);
  let redChannel = sourceImg.get();
  redChannel.loadPixels();

  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, r} = getPixelData(redChannel, x, y);
      redChannel.pixels[position] = r;      // Keep red
      redChannel.pixels[position + 1] = 0;  // Remove green
      redChannel.pixels[position + 2] = 0;  // Remove blue
      redChannel.pixels[position + 3] = 255;// Full alpha
    }
  }
  
  redChannel.updatePixels();
  image(redChannel, 0, 0);
  redChannel.resize(viewConfig.width, viewConfig.height);
}

function extractGreenComponent() {
  translate(viewConfig.width + 10, 0);
  let greenChannel = sourceImg.get();
  greenChannel.loadPixels();

  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, g} = getPixelData(greenChannel, x, y);
      greenChannel.pixels[position] = 0;      // Remove red
      greenChannel.pixels[position + 1] = g;  // Keep green
      greenChannel.pixels[position + 2] = 0;  // Remove blue
      greenChannel.pixels[position + 3] = 255;// Full alpha
    }
  }
  
  greenChannel.updatePixels();
  image(greenChannel, 0, 0);
  greenChannel.resize(viewConfig.width, viewConfig.height);
}

function extractBlueComponent() {
  translate(viewConfig.width + 10, 0);
  let blueChannel = sourceImg.get();
  blueChannel.loadPixels();

  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, b} = getPixelData(blueChannel, x, y);
      blueChannel.pixels[position] = 0;      // Remove red
      blueChannel.pixels[position + 1] = 0;  // Remove green
      blueChannel.pixels[position + 2] = b;  // Keep blue
      blueChannel.pixels[position + 3] = 255;// Full alpha
    }
  }
  
  blueChannel.updatePixels();
  image(blueChannel, 0, 0);
  blueChannel.resize(viewConfig.width, viewConfig.height);
}

// THRESHOLD OPERATIONS TASK 7 
function thresholdRedChannel(cutoffValue) {
  translate(-viewConfig.width*2 - 20, viewConfig.height + 10);
  let redFiltered = sourceImg.get();
  redFiltered.loadPixels();

  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, r} = getPixelData(redFiltered, x, y);
      
      // Binary threshold - keep red channel only if above threshold
      if (r > cutoffValue) {
        redFiltered.pixels[position] = r;
        redFiltered.pixels[position + 1] = 0;
        redFiltered.pixels[position + 2] = 0;
      } else {
        redFiltered.pixels[position] = 0;
        redFiltered.pixels[position + 1] = 0;
        redFiltered.pixels[position + 2] = 0;
      }
      redFiltered.pixels[position + 3] = 255;
    }
  }
  
  redFiltered.updatePixels();
  image(redFiltered, 0, 0);
  redFiltered.resize(viewConfig.width, viewConfig.height);
}

function thresholdGreenChannel(cutoffValue) {
  translate(viewConfig.width + 10, 0);
  let greenFiltered = sourceImg.get();
  greenFiltered.loadPixels();

  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, g} = getPixelData(greenFiltered, x, y);
      
      // Binary threshold - keep green channel only if above threshold
      if (g > cutoffValue) {
        greenFiltered.pixels[position] = 0;
        greenFiltered.pixels[position + 1] = g;
        greenFiltered.pixels[position + 2] = 0;
      } else {
        greenFiltered.pixels[position] = 0;
        greenFiltered.pixels[position + 1] = 0;
        greenFiltered.pixels[position + 2] = 0;
      }
      greenFiltered.pixels[position + 3] = 255;
    }
  }
  
  greenFiltered.updatePixels();
  image(greenFiltered, 0, 0);
  greenFiltered.resize(viewConfig.width, viewConfig.height);
}

function thresholdBlueChannel(cutoffValue) {
  translate(viewConfig.width + 10, 0);
  let blueFiltered = sourceImg.get();
  blueFiltered.loadPixels();

  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, b} = getPixelData(blueFiltered, x, y);
      
      // Binary threshold - keep blue channel only if above threshold
      if (b > cutoffValue) {
        blueFiltered.pixels[position] = 0;
        blueFiltered.pixels[position + 1] = 0;
        blueFiltered.pixels[position + 2] = b;
      } else {
        blueFiltered.pixels[position] = 0;
        blueFiltered.pixels[position + 1] = 0;
        blueFiltered.pixels[position + 2] = 0;
      }
      blueFiltered.pixels[position + 3] = 255;
    }
  }
  
  blueFiltered.updatePixels();
  image(blueFiltered, 0, 0);
  blueFiltered.resize(viewConfig.width, viewConfig.height);
}

// BRIGHTNESS SEGMENTATION
function drawGreyscaleAndBrightnesswSlider(threshold) {
  push();
  translate(viewConfig.width + 10, 0);
  let copyImg = sourceImg.get();
  copyImg.loadPixels();

  for (let y = 0; y < copyImg.height; y++) {
    for (let x = 0; x < copyImg.width; x++) {
      const {position, r, g, b} = getPixelData(copyImg, x, y);
      const ave = (r + g + b) / 3;
      const brightness = ave * (1 + (BSslider.value() / 100));

      // Brightness segmentation
      if (brightness > threshold) {
        copyImg.pixels[position] = 255;
        copyImg.pixels[position + 1] = 255;
        copyImg.pixels[position + 2] = 255;
      } else {
        copyImg.pixels[position] = 0;
        copyImg.pixels[position + 1] = 0;
        copyImg.pixels[position + 2] = 0;
      }
    }
  }
  copyImg.updatePixels();
  image(copyImg, 0, 0);
  copyImg.resize(viewConfig.width, viewConfig.height);
  pop();
}

// COLOR SPACE CONVERSIONS TASK 9
// Reusable function for RGB to CMYK conversion
function convertRGBtoCMYK(inputImage) {
  // Optional parameter - if not provided, use sourceImg as default
  const sourceImage = inputImage || sourceImg;
  
  // Copy of the image for CMYK conversion
  let cmykImage = sourceImage.get();
  cmykImage.loadPixels();
  sourceImage.loadPixels();

  for (let i = 0; i < cmykImage.height; i++) {
    for (let j = 0; j < cmykImage.width; j++) {
      const pixelPosition = ((cmykImage.width * i) + j) * 4;
      
      const r = sourceImage.pixels[pixelPosition];
      const g = sourceImage.pixels[pixelPosition + 1];
      const b = sourceImage.pixels[pixelPosition + 2];
      
      const rScaled = r / 255;
      const gScaled = g / 255;
      const bScaled = b / 255;

      const k = Math.min(1 - rScaled, 1 - gScaled, 1 - bScaled);
      const c = k === 1 ? 0 : ((1 - rScaled - k) / (1 - k));
      const m = k === 1 ? 0 : ((1 - gScaled - k) / (1 - k));
      const y = k === 1 ? 0 : ((1 - bScaled - k) / (1 - k));

      cmykImage.pixels[pixelPosition] = c * 255;
      cmykImage.pixels[pixelPosition + 1] = m * 255;
      cmykImage.pixels[pixelPosition + 2] = y * 255;
      cmykImage.pixels[pixelPosition + 3] = 255;
    }
  }
  
  cmykImage.updatePixels();
  return cmykImage;
}

// Display version of the function that includes positioning
function displayConvertRGBtoCMYK() {
  translate(viewConfig.width + 20, 10);
  let cmykImage = convertRGBtoCMYK();
  image(cmykImage, 0, 0);
  cmykImage.resize(viewConfig.width, viewConfig.height);
}

function convertRGBtoYCbCr() {
  translate(viewConfig.width + 10, 0);
  let ycbcrImage = sourceImg.get();
  ycbcrImage.loadPixels();

  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, r, g, b} = getPixelData(ycbcrImage, x, y);

      // Apply YCbCr conversion formula
      const Y = 0.299 * r + 0.587 * g + 0.114 * b;
      const Cb = 128 + (-0.169 * r - 0.331 * g + 0.5 * b);
      const Cr = 128 + (0.5 * r - 0.419 * g - 0.081 * b);

      // Store in RGB channels for visualization
      ycbcrImage.pixels[position] = Y;
      ycbcrImage.pixels[position + 1] = Cb;
      ycbcrImage.pixels[position + 2] = Cr;
      ycbcrImage.pixels[position + 3] = 255;
    }
  }
  
  ycbcrImage.updatePixels();
  image(ycbcrImage, 0, 0);
  ycbcrImage.resize(viewConfig.width, viewConfig.height);
}

 // COLOR SPACE WITH THRESHOLDING TASK 10
function thresholdCMYK() {
  translate(viewConfig.width + 10, 0);
  let thresholdedCMYK = sourceImg.get();
  thresholdedCMYK.loadPixels();
  sourceImg.loadPixels(); // Ensure source image pixels are loaded

  // Get threshold from slider
  const threshold = colorSpaceSlider.value() / 250;
  
  for (let i = 0; i < thresholdedCMYK.height; i++) {
    for (let j = 0; j < thresholdedCMYK.width; j++) {
      // Calculate pixel position directly
      const pixelPosition = ((thresholdedCMYK.width * i) + j) * 4;
      
      // Get RGB values directly
      const r = sourceImg.pixels[pixelPosition];
      const g = sourceImg.pixels[pixelPosition + 1];
      const b = sourceImg.pixels[pixelPosition + 2];
      
      // Normalize RGB values
      const rScaled = r / 255;
      const gScaled = g / 255;
      const bScaled = b / 255;

      // CMYK calculation
      const k = Math.min(1 - rScaled, 1 - gScaled, 1 - bScaled);
      const c = k === 1 ? 0 : ((1 - rScaled - k) / (1 - k));
      const m = k === 1 ? 0 : ((1 - gScaled - k) / (1 - k));
      const y = k === 1 ? 0 : ((1 - bScaled - k) / (1 - k));

      // Apply binary threshold to CMYK channels
      thresholdedCMYK.pixels[pixelPosition] = c > threshold ? 255 : 0;
      thresholdedCMYK.pixels[pixelPosition + 1] = m > threshold ? 255 : 0;
      thresholdedCMYK.pixels[pixelPosition + 2] = y > threshold ? 255 : 0;
      thresholdedCMYK.pixels[pixelPosition + 3] = 255;
    }
  }
  
  thresholdedCMYK.updatePixels();
  image(thresholdedCMYK, 0, 0);
  thresholdedCMYK.resize(viewConfig.width, viewConfig.height);
}

function thresholdYCbCr() {
  translate(viewConfig.width + 10, 0);
  let thresholdedYCbCr = sourceImg.get();
  thresholdedYCbCr.loadPixels();

  // Get threshold from slider
  const yThreshold = brightnessSlider.value();
  
  for (let y = 0; y < sourceImg.height; y++) {
    for (let x = 0; x < sourceImg.width; x++) {
      const {position, r, g, b} = getPixelData(thresholdedYCbCr, x, y);

      // Standard YCbCr conversion
      const Y = 0.299 * r + 0.587 * g + 0.114 * b;
      const Cb = 128 + (-0.169 * r - 0.331 * g + 0.5 * b);
      const Cr = 128 + (0.5 * r - 0.419 * g - 0.081 * b);
      
      // Binary thresholding on Y channel only
      let resultR = Y > yThreshold ? 255 : 0;
      
      // Store in RGB channels
      thresholdedYCbCr.pixels[position] = resultR;
      thresholdedYCbCr.pixels[position + 1] = Cb;
      thresholdedYCbCr.pixels[position + 2] = Cr;
      thresholdedYCbCr.pixels[position + 3] = 255;
    }
  }
  
  thresholdedYCbCr.updatePixels();
  image(thresholdedYCbCr, 0, 0);
  thresholdedYCbCr.resize(viewConfig.width, viewConfig.height);
}

// FACE DETECTION AND FILTERS TASK 12 AND 13
function detectAndFilterFaces() {
  translate(-viewConfig.width*2 - 20, viewConfig.height + 10);
  image(videoInput, 0, 0, viewConfig.width, viewConfig.height);

  frameCaptureBuffer.copy(videoInput, 0, 0, videoInput.width, videoInput.height, 0, 0, videoInput.width, videoInput.height);
  detectedFaces = faceDetector.detect(frameCaptureBuffer.canvas);

  // Face detection using bounding box
  for (let i = 0; i < detectedFaces.length; i++) {
    const face = detectedFaces[i];
    if (face[4] > 4) { // Confidence check
      const facePortion = frameCaptureBuffer.get(face[0], face[1], face[2], face[3]);
      applySelectedFilter(facePortion);
      image(facePortion, face[0], face[1]);
    }
  }
}

function applySelectedFilter(faceImage) {
  switch (currentFilterMode) {
    case 1: // Greyscale converted image
      faceImage.filter(GRAY);
      break;

    case 2: // Blurred image
      faceImage.filter(BLUR, 4);
      break;

    case 3: // Colour converted image
      applyCMYKtoFace(faceImage);
      break;

    case 4: // Pixelate image
      faceImage.filter(GRAY);
      createMosaicEffect(faceImage, 5);
      break;

    default:
      break;
  }
}

// Apply CMYK effect to detected faces
function applyCMYKtoFace(faceImage) {
  // Make sure we have valid image data to work with
  if (!faceImage || faceImage.width <= 0 || faceImage.height <= 0) {
    console.error("Invalid face image data");
    return;
  }
  
  // Call the reusable function with our face image
  const convertedImage = convertRGBtoCMYK(faceImage);
  
  // Copy the converted image data back to the original face image
  faceImage.copy(convertedImage, 0, 0, faceImage.width, faceImage.height, 0, 0, faceImage.width, faceImage.height);
}

// Pixelate filter with nested loops and average
function createMosaicEffect(faceImage, blockSize) {
  faceImage.loadPixels();

  for (let y = 0; y < faceImage.height; y += blockSize) {
    for (let x = 0; x < faceImage.width; x += blockSize) {
      let totalValue = 0;
      let pixelsInBlock = 0;

      // Compute block average
      for (let blockY = y; blockY < Math.min(y + blockSize, faceImage.height); blockY++) {
        for (let blockX = x; blockX < Math.min(x + blockSize, faceImage.width); blockX++) {
          const position = ((faceImage.width * blockY) + blockX) * 4;
          totalValue += faceImage.pixels[position];
          pixelsInBlock++;
        }
      }

      const averageValue = totalValue / pixelsInBlock;

      // Apply average value to entire block
      for (let blockY = y; blockY < Math.min(y + blockSize, faceImage.height); blockY++) {
        for (let blockX = x; blockX < Math.min(x + blockSize, faceImage.width); blockX++) {
          const position = ((faceImage.width * blockY) + blockX) * 4;
          faceImage.pixels[position] = averageValue;
          faceImage.pixels[position + 1] = averageValue;
          faceImage.pixels[position + 2] = averageValue;
        }
      }
    }
  }
  
  faceImage.updatePixels();
}

// AR FACE ACCESSORIES MY EXTENSION
function applyFaceAccessories() {
  translate(-viewConfig.width*2 - 20, viewConfig.height*2 + 70);
  image(secondaryVideo, 0, 0, viewConfig.width, viewConfig.height);

  frameCaptureBuffer.copy(secondaryVideo, 0, 0, secondaryVideo.width, secondaryVideo.height, 0, 0, secondaryVideo.width, secondaryVideo.height);
  const faces = faceDetector.detect(frameCaptureBuffer.canvas);

  // Filter faces by confidence level and remove duplicates
  const validFaces = [];
  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    // Only consider faces with confidence > 4 (same as in detectAndFilterFaces)
    if (face[4] > 4) {
      // Check if this face is too close to any already added face
      let isDuplicate = false;
      for (let j = 0; j < validFaces.length; j++) {
        const existingFace = validFaces[j];
        const distance = Math.sqrt(
          Math.pow(face[0] - existingFace[0], 2) + 
          Math.pow(face[1] - existingFace[1], 2)
        );
        // If faces are very close to each other, consider them duplicates
        if (distance < face[2] * 0.5) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        validFaces.push(face);
      }
    }
  }
  
  secondaryVideo.loadPixels();
  for (let i = 0; i < validFaces.length; i++) {
    const face = validFaces[i];
    
    if (accessorySelector.value() === 'Animal') {
      // Calculate accessory positions
      const earsX = face[0] + face[2] * 0.05;
      const earsY = face[1] - face[3] * 0.25;
      const earsW = face[2] * 0.9;
      const earsH = face[3] * 0.5;
      
      const snoutX = face[0] + face[2] * -0.06;
      const snoutY = face[1] + face[3] * -0.11;
      const snoutW = face[2] * 1.1;
      const snoutH = face[3] * 1.1;
      
      // Render accessories
      image(animalEars, earsX, earsY, earsW, earsH);
      image(animalSnout, snoutX, snoutY, snoutW, snoutH);
    } 
    else if (accessorySelector.value() === 'Costume') {
      // Get face dimensions
      const faceX = face[0];
      const faceY = face[1];
      const faceW = face[2];
      const faceH = face[3];
      
      // Position costume accessories
      const accessory1X = faceX + faceW * 0.6;
      const accessory1Y = faceY - faceH * 0.1;
      const accessory1Size = 4;
      const accessory1W = costumeAccessory1.width * 0.05;
      const accessory1H = costumeAccessory1.height * 0.05;
      
      const accessory2X = faceX + faceW * -1.0;
      const accessory2Y = faceY + faceH * 0.8;
      const accessory2Size = 1.0;
      const accessory2W = costumeAccessory2.width * 0.04;
      const accessory2H = costumeAccessory2.height * 0.04;
      
      // Render accessories
      image(costumeAccessory1, accessory1X, accessory1Y, accessory1W * accessory1Size, accessory1H * accessory1Size);
      image(costumeAccessory2, accessory2X, accessory2Y, accessory2W * accessory2Size, accessory2H * accessory2Size);
    }
  }
  secondaryVideo.updatePixels();
}

// FILTER SELECTION HANDLER
function handleFilterChange() {
  let selectedOption = accessorySelector.value();
  console.log('Selected accessory type:', selectedOption);
}