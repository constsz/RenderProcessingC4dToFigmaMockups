import { createPathsForPass } from '../dataManipulation/filesystem.js';
import * as gm from '../imageProcessingModules/runGm.js';
import * as photoshop from '../imageProcessingModules/runPs.js';
import * as python from '../imageProcessingModules/runPython.js';

export async function imageProcessing(item, material, camera, grp_number, pass, initSettings) {
  const pathsForPass = await createPathsForPass(item, material, camera, grp_number, pass, initSettings);
  let pythonResponse;
  // recieves a SINGLE Pass
  // 1. To define the right tool
  // 2. Run command for selected tool: open, process, save
  // 3. Communicate that it's "Done"
  // MASK → GM
  if (pass.type == 'mask' && pass.processing.length == 1 && pass.processing[0].effectName == 'Invert') {
    // await gm.invert(pass, pathsForPass);
    console.log('----');
    console.log('new Mask created ...');
  }
  // SCREEN COORDS → Python
  else if (pass.type == 'screen_coords') {
    const screenCoords = await python.findScreenCoords(pathsForPass.masks.input);
    pythonResponse = screenCoords;
    console.log('----');
    console.log('screenCoords: ', screenCoords);
  }
  // IMAGE → PHOTOSHOP
  else if (pass.type == 'raster' || pass.type == 'mask_subtract') {
    // await photoshop.run(pass, pathsForPass, initSettings);
    console.log('----');
    console.log('raster file created ...');
  }

  return {
    pass,
    pathsForPass,
    pythonResponse,
  };
}
