import fs from 'fs';
import { resolve } from 'path';
const fsp = fs.promises;

export function readJsonFile(path) {
  let data = fs.readFileSync(resolve(process.cwd(), path));
  data = JSON.parse(data);
  return data;
}

export function getItemCombinationName(item, material, camera, grp_number, pass) {
  try {
    if (pass.specialMaterial) {
      return (item.name + ' - ' + pass.specialMaterial + ' - ' + camera.name + ' - ' + 'grp_' + grp_number).replaceAll(' ', '_');
    } else {
      return (item.name + ' - ' + material + ' - ' + camera.name + ' - ' + 'grp_' + grp_number).replaceAll(' ', '_'); // 'grp_' решается на c4d_py > io_generateTakes.py:130
    }
  } catch {
    return (item.name + ' - ' + material + ' - ' + camera.name + ' - ' + 'grp_' + grp_number).replaceAll(' ', '_'); // 'grp_' решается на c4d_py > io_generateTakes.py:130
  }
}

export function createMasksPathsForPassExport(pass, imagePaths, initSettings) {
  if (pass.type == 'mask' || pass.type == 'screen_coords') {
    return {
      input: imagePaths.inputPath + '/' + pass.renderPass + initSettings.imageFormat,
      output: imagePaths.outputPathMasksRaster + '/' + imagePaths.itemCombinationName + '__' + pass.outputName,
    };
  } else {
    return null;
  }
}

export async function createPathsForPass(item, material, camera, grp_number, pass, initSettings) {
  // Main stuff
  // Phone_with_Card_-_#plastic_-_v1_-_grp_1   // (!) ←-- includes specialMaterial case
  const itemCombinationName = getItemCombinationName(item, material, camera, grp_number, pass);
  const itemCombinationPassName = itemCombinationName + '__' + pass.outputName;
  const inputPath = initSettings.rendersFolder + '/' + item.name + '/' + itemCombinationName;
  const outputPath = initSettings.outputFolder + '/' + item.name;
  // Folder structure
  const folders = [
    {
      folder: 'raster',
      subfolder: null,
    },
    {
      folder: 'screen_coords',
      subfolder: null,
    },
    {
      folder: 'masks',
      subfolder: 'converted',
    },
  ];

  const imageFileName = pass.renderPass + initSettings.imageFormat;

  // не понятно нахуя это нужно, пока выключил
  // pass.outputName = pass.outputName.replaceAll(' ', '_');

  // Data Object
  const dataObject = {
    itemCombinationName,
    itemCombinationPassName,

    main: {
      input: inputPath,
      output: outputPath,
    },

    image: {
      input: inputPath + '/' + imageFileName,
      output: outputPath + '/' + folders.find((f) => f.folder == 'raster').folder + '/' + itemCombinationPassName,
      imageFormat: initSettings.imageFormat,
    },

    masks: {
      input: inputPath + '/' + pass.renderPass + initSettings.imageFormat,
      outputRaster: outputPath + '/' + folders.find((f) => f.folder == 'masks').folder + '/' + itemCombinationPassName + '.png',
      outputConverted:
        initSettings.outputFolder +
        '/' +
        folders.find((f) => f.folder == 'masks').folder +
        '/' +
        folders.find((f) => f.folder == 'masks').subfolder,
    },
  };

  // Create corresponding folders
  return (
    fsp
      // Check Input folder
      .access(inputPath + '/' + imageFileName)
      .then((res) => {
        // console.log('INPUT Folder ' + itemCombinationName + ' Exists');
      })
      .catch((e) => {
        let warning =
          '(!) ERROR!!! \nINPUT FOLDER ' + itemCombinationName + ' NOT FOUND! \n    filesystem.js > createImagePathsForPassExport()\n';

        process.exit();
        return Promise.reject();
      })
      // Check Output folder
      .then(() => {
        let folderToCreate = '';
        for (let f of folders) {
          if (f.subfolder) {
            folderToCreate = outputPath + '/' + f.folder + '/' + f.subfolder;
          } else {
            folderToCreate = outputPath + '/' + f.folder;
          }
          fsp.mkdir(folderToCreate, { recursive: true });
        }
      })
      .then((res) => {
        return dataObject;
      })
      .catch((e) => {
        console.log('OUTPUT Folder ' + itemCombinationName + ' Exists and WAS NOT created');
        return dataObject;
      })
  );
}

export function moveScreenCoordsFiles(item, material, camera, grp_number, recipe, initSettings) {
  const pass = recipe.notation.find((p) => p.type == 'screen_coords');

  if (pass) {
    return new Promise((resolve, reject) => {
      // check if screen_coords.tif exists
      // if yes - return resolve
      // if no - move image and resolve
      const oldFileName = 'A_Beauty' + initSettings.imageFormat;
      const newFileName = pass.renderPass + initSettings.imageFormat;
      const itemCombinationName = getItemCombinationName(item, material, camera, grp_number, null);
      const oldPath = initSettings.rendersFolder + '/' + item.name + '/' + itemCombinationName + pass.suffix + '/' + oldFileName;
      const newPath = initSettings.rendersFolder + '/' + item.name + '/' + itemCombinationName + '/' + newFileName;

      if (fs.existsSync(newPath)) {
        // console.log(''SCREEN COORDS FILE EXISTS);
        return resolve();
      } else {
        console.log('NO SCREEN COORDS FILE FOUND ---- CREATING NEW ONE');
        fs.renameSync(oldPath, newPath);
        return resolve();
      }
    });
  } else {
    return resolve();
  }
}

// Photoshop Busy functions

export function setPhotoshopBusy(trueOrFalseString, initSettings) {
  const busyFilePath = initSettings.settingsProgram.busyFilePath;
  fs.writeFileSync(busyFilePath, trueOrFalseString);
}

export function checkPhothoshopBusy(initSettings) {
  const busyFilePath = initSettings.settingsProgram.busyFilePath;
  const busy = fs.readFileSync(busyFilePath, {
    encoding: 'UTF-8',
  });
  return busy;
}

// convert image to base64
// function to encode file data to base64 encoded string
export function base64Encode(filePath) {
  // read bindary data
  const bitmap = fs.readFileSync(filePath);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}
