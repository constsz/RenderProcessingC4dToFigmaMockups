// JSON read
function readJsonFile(path) {
  var jsonFile = File(path);
  jsonFile.open("r");
  var content = jsonFile.read();
  content = JSON.parse(content);
  jsonFile.close();
  return content;
}

// Image Processing
function getBlendMode(string) {
  str = string.toLowerCase();
  var bm;
  switch (str) {
    case "normal":
      bm = BlendMode.NORMAL;
      break;
    case "multiply":
      bm = BlendMode.MULTIPLY;
      break;
    case "screen":
      bm = BlendMode.SCREEN;
      break;
    case "soft light":
      bm = BlendMode.SOFTLIGHT;
      break;
    case "hard light":
      bm = BlendMode.HARDLIGHT;
      break;
    case "overlay":
      bm = BlendMode.OVERLAY;
      break;
    case "color":
      bm = BlendMode.COLORBLEND;
      break;
  }
  return bm;
}

function fill_solid_color(layer, color_array) {
  activeDocument.activeLayer = layer;

  var fill_color = new SolidColor();
  fill_color.rgb.red = color_array[0];
  fill_color.rgb.green = color_array[1];
  fill_color.rgb.blue = color_array[2];

  activeDocument.selection.fill(fill_color);
}

function composeOnTop(effect, inputPath, imageFormat) {
  var second_pass_file = new File(
    inputPath + "/" + effect.renderPass + imageFormat
  );

  open(second_pass_file);
  activeDocument.layers[0].copy();
  close(activeDocument);

  var layer_reflections = activeDocument.paste();
  desaturate_сolor(layer_reflections);
  layer_reflections.blendMode = getBlendMode(effect.blendMode);
  layer_reflections.opacity = effect.opacity;
  layer_reflections.merge();
}

function maskSubtract(effect, inputPath, imageFormat) {
  var second_mask_file = new File(
    inputPath + "/" + effect.renderPass + imageFormat
  );

  // separate into 2 layers: main mask and background
  var layer_mask_main = activeDocument.layers[0].duplicate();
  var layer_bg = activeDocument.layers[activeDocument.layers.length - 1];

  // fill that shit!

  fill_solid_color(layer_bg, [0, 0, 0]);

  // second mask - open, copy
  open(second_mask_file);
  activeDocument.layers[0].copy();
  close(activeDocument);

  // create mask for main mask, paste to mask
  activeDocument.activeLayer = layer_mask_main;

  addMask();
  select_mask();
  activeDocument.selection.selectAll();
  try {
    activeDocument.paste();
  } catch (e) {}
}

function applyMask(layer, effect, inputPath, imageFormat) {
  var mask_file = new File(
    inputPath + "/" + effect.mask.renderPass + imageFormat
  );

  open(mask_file);
  // IF mask has effects as well
  try {
    if (effect.effectName.toLowerCase() == "cropSizeOptimize".toLowerCase()) {
      activeDocument.layers[0].applyMaximum(effect.mask.maximumRadius);
    }
    if (effect.mask.inverted) {
      activeDocument.layers[0].invert();
    }
  } catch (e) {}

  activeDocument.layers[0].copy();
  close(activeDocument);

  activeDocument.activeLayer = layer;

  addMask();
  select_mask();
  activeDocument.selection.selectAll();
  try {
    activeDocument.paste();
  } catch (e) {}
}

function cropSizeOptimize(effect, inputPath, imageFormat) {
  var layer_beauty = activeDocument.activeLayer.duplicate();

  var layer_background =
    activeDocument.layers[activeDocument.layers.length - 1];

  var clr = [0, 0, 0];
  if (effect.bgColor == "white") {
    clr = [255, 255, 255];
  }

  fill_solid_color(layer_background, clr);

  applyMask(layer_beauty, effect, inputPath, imageFormat);
}

function desaturate_layer(effect, inputPath, imageFormat) {
  var new_layer = activeDocument.activeLayer.duplicate();
  new_layer.blendMode = BlendMode.COLORBLEND;
  activeDocument.activeLayer = new_layer;
  new_layer.desaturate();

  try {
    if (effect.mask) {
      applyMask(new_layer, effect, inputPath, imageFormat);
    }
  } catch (e) {
    console.log("no mask");
  }

  new_layer.merge();
  return new_layer;
}

function safe_background_for_pass_with_blend_mode(
  pass,
  inputPath,
  imageFormat
) {
  var willBeBlendMode = pass.willBeBlendMode;
  if (willBeBlendMode) {
    var layer_background = activeDocument.layers[0];
    var layer_content = activeDocument.layers[0].duplicate();
    var specialBackgroundFound = false;
    var bgGray = ["Soft Light", "Hard Light", "Overlay"];
    var bgBlack = ["Screen", "Add", "Lighten", "Color Dodge"];
    var bgWhite = ["Multiply", "Darken", "Color Burn"];

    // check if willBeBlendMode exists in one of arrays
    if (check_if_exists_in_array(bgGray, willBeBlendMode)) {
      bgColor = 128;
      specialBackgroundFound = true;
    } else if (check_if_exists_in_array(bgBlack, willBeBlendMode)) {
      bgColor = 0;
      specialBackgroundFound = true;
    } else if (check_if_exists_in_array(bgWhite, willBeBlendMode)) {
      bgColor = 255;
      specialBackgroundFound = true;
    }

    if (specialBackgroundFound) {
      // Do recoloring background actions //

      // What mask to use? 1: Main A_Beauty or Contour?
      var useOptimizedContour = false;
      var mask_name = "A_Beauty";
      var maximumRadius = 0;
      for (var i = 0; i < pass.processing.length; i++) {
        var effect = pass.processing[i];
        if (effect.effectName == "cropSizeOptimize") {
          useOptimizedContour = true;
          mask_name = effect.mask.renderPass;
          maximumRadius = effect.mask.maximumRadius;
        }
      }
      maskFile = new File(inputPath + "/" + mask_name + imageFormat);

      //  - open/copy/paste corresponding mask
      open(maskFile);
      if (useOptimizedContour) {
        activeDocument.layers[0].applyMaximum(maximumRadius);
      }

      activeDocument.layers[0].copy();
      close(activeDocument);

      activeDocument.activeLayer = layer_content;

      //  - apply that mask to content layer of current flattened image
      addMask();
      select_mask();
      activeDocument.selection.selectAll();
      try {
        activeDocument.paste();
      } catch (e) {}
      // apply_selected_layer_mask();

      //  - fill the background according to bgColor
      activeDocument.activeLayer = layer_background;
      // createNewLayer("Background Fill", "below");
      // var backgroundFill = activeDocument.activeLayer;

      fill_solid_color(activeDocument.activeLayer, [bgColor, bgColor, bgColor]);
    }
  }
}
