#target photoshop
#include 'C:/Users/kosty/Documents/Adobe Scripts/node_render2app/utils/includes.jsx'
#include 'C:/Users/kosty/Documents/Adobe Scripts/node_render2app/functions.jsx'
#include 'C:/Users/kosty/Documents/Adobe Scripts/iographics_modules/generalFunctions.jsx'

/* 
  1. Initiate
  2. Processing
  3. Export
*/

// 1. INIT
var commands = readJsonFile(
  "D:/io.graphics/render2app/main/recipes/_exchange/executePhotoshop.json"
);

var pass = commands.pass;
var processing = pass.processing;

var pathsForPass = commands.pathsForPass;
var itemCombinationName = pathsForPass.itemCombinationName;
var itemCombinationPassName = pathsForPass.itemCombinationPassName;
var inputPath = pathsForPass.main.input;

if (pass.type == "mask" || pass.type == "mask_subtract") {
  var outputPath = pathsForPass.main.output + "/" + "masks";
}
else if (pass.type == "raster") {
  var outputPath = pathsForPass.main.output + "/" + "raster";
}

var inputImagePath = pathsForPass.image.input;
var outputImagePath = pathsForPass.image.output;
var imageFormat = pathsForPass.image.imageFormat;

// var workingImagePaths = commands.workingImagePaths;

var renderFile = new File(inputImagePath);
open(renderFile);
var doc = activeDocument


// 
// 2. PROCESSING
// # do for all
if (pass.type == "raster") {
  reduce_noise(5,10,0,0)
}

// # loop processing commands individually for each pass
for (var i=0; i<processing.length; i++) {
  var effect = processing[i];
  var effectName = effect.effectName.toLowerCase();

  if (effectName == "desaturate") {
    desaturate_layer(effect, inputPath, imageFormat)
  }
  if (effectName == "levels") {
    doc.activeLayer.adjustLevels(effect.settings[0], effect.settings[1],effect.settings[2],effect.settings[3],effect.settings[4])
  }
  if (effectName == "flatten") {
    activeDocument.flatten()
  }
  if (effectName == "invert") {
    activeDocument.activeLayer.invert()
  }
  if (effectName == "composeOnTop".toLowerCase()) {
    composeOnTop(effect, inputPath, imageFormat)
  }
  if (effectName == "maskSubtract".toLowerCase()) {
    maskSubtract(effect, inputPath, imageFormat)
  }
  if (effectName == "cropSizeOptimize".toLowerCase()) {
    cropSizeOptimize(effect, inputPath, imageFormat)
    activeDocument.flatten()
  }
}

// 3. DEFAULT PREPARATIONS BEFORE EXPORT
activeDocument.flatten();

safe_background_for_pass_with_blend_mode(pass, inputPath, imageFormat);


// 
// 4. EXPORT
if (pass.type == "raster") {
  save_as_jpg (outputPath, itemCombinationPassName, 81)
} else if (pass.type == "mask" || pass.type == "mask_subtract") {
  save_as_png(outputPath, itemCombinationPassName)
}

doc.close(SaveOptions.DONOTSAVECHANGES)

var fileOut = new File(
  "D:/io.graphics/render2app/main/recipes/_exchange/PhotoshopBusy.ini"
);
fileOut.encoding = "UTF8";
fileOut.open("w");
fileOut.write("false");
fileOut.close();