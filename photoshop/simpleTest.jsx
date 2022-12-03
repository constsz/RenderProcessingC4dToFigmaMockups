#target photoshop
#include 'C:/Users/kosty/Documents/Adobe Scripts/node_render2app/utils/includes.jsx'
#include 'C:/Users/kosty/Documents/Adobe Scripts/node_render2app/functions.jsx'
#include 'C:/Users/kosty/Documents/Adobe Scripts/iographics_modules/iographics_general_functions.jsx'

/* 
  1. Initiate
  2. Processing
  3. Export
*/

// 1. INIT
var commands = readJsonFile(
  "D:/io.graphics/render2app/recipes/_exchange/executePhotoshop.json"
);

var pass = commands.pass;
var processing = pass.processing;
var inputPath = commands.inputPath;
var outputPath = commands.outputPath;
var workingImagePaths = commands.workingImagePaths;

var renderFile = new File(workingImagePaths.input);

open(renderFile);
var doc = activeDocument

doc.close(SaveOptions.DONOTSAVECHANGES)

var fileBusy = new File(
  "D:/io.graphics/render2app/recipes/_exchange/PhotoshopBusy.ini"
);
fileBusy.encoding = "UTF8";
fileBusy.open("w");
fileBusy.write("false");
fileBusy.close();
