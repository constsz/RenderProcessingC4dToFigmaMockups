import { readJsonFile } from '../../src/dataManipulation/filesystem.js';
const figmaRecipesPath = '../recipes/figma/';

//
//
// ↓ USER INPUT

const settingsMain = {
  recipeName: 'ps_hands_v2.js',

  projectName: 'hands',
  renderIteration: '06_allGood_vol1',
  renderFolder: '03 render',
  basePath: 'E:/Dropbox/work/projects_iographics',

  exportRoot: 'E:/Dropbox/work/projects_iographics',
  exportFolder: '05 fig',
  imageFormat: '.tif',

  grpSpecs: {
    1: { type: 'simple', name: 'main', code: 'main' },
    2: { type: 'obj1_var', name: 'iPhone 12 Pro', code: 'iPhone12Pro' },
    3: { type: 'obj1_var', name: 'Samsung S21', code: 'SamsungS21' },
    4: { type: 'obj2_var', name: 'Plastic Card', code: 'pCard' },
  },

  c4d_db_name: 'c4d_db4_(oneItem_grp2).json',
  figmaNotation: readJsonFile(figmaRecipesPath + 'hands.json'),
};

const settingsUserPrefs = {
  onlyMaterial: null,
  onlyItem: null,
  ignoreSpecialMaterials: ['#plastic_diffuse'],
};

const settingsProgram = {
  busyFilePath: './recipes/_exchange/PhotoshopBusy.ini',
};

//

//

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ↓ Generate Settings

const { default: recipesImport } = await import('../ps/' + settingsMain.recipeName);
const recipes = recipesImport();

export const initSettings = {
  recipes,
  figmaNotation: settingsMain.figmaNotation,
  imageFormat: settingsMain.imageFormat,
  grpSpecs: settingsMain.grpSpecs,
  onlyMaterial: settingsUserPrefs.onlyMaterial,
  onlyItem: settingsUserPrefs.onlyItem,
  ignoreSpecialMaterials: settingsUserPrefs.ignoreSpecialMaterials,
  familyName: settingsMain.projectName,
  rendersFolder:
    settingsMain.basePath + '/' + settingsMain.projectName + '/' + settingsMain.renderFolder + '/' + settingsMain.renderIteration,
  outputFolder:
    settingsMain.exportRoot + '/' + settingsMain.projectName + '/' + settingsMain.exportFolder + '/' + settingsMain.renderIteration,
  settingsProgram,
  c4d_db_name: settingsMain.c4d_db_name,
};
