// Append preNotation to all Recipes that require it
export function preNotationConcat(recipes) {
  for (let r of recipes) {
    // find recipes with preNotation
    if (r.preNotation) {
      const preNotation = recipes.find(({ grp }) => grp.includes(r.preNotation)).notation;
      // concat to it's notation
      r.notation = r.notation.concat(preNotation);
    }
  }

  return recipes;
}

// use imageProcessingResponse to create a "Pass" data
// for JsonSplit item
export function createPassData(imageProcessingResponse) {
  const pass = imageProcessingResponse.pass;
  const pfp = imageProcessingResponse.pathsForPass;
  const pythonData = imageProcessingResponse.pythonData;

  const passData = {
    name: pass.outputName,
    content: {
      type: '', // image, svg, coords
      data: '',
    },
  };

  if (pass.type == 'raster') {
    passData.content.type = 'image';
    passData.content.data = pfp.image.output + '.jpg';
  } else if (pass.type == 'mask') {
    passData.content.type = 'svg';
    passData.content.data = pfp.masks.outputConverted + '/' + pfp.itemCombinationPassName + '.svg';
  } else if (pass.type == 'mask-subtract') {
    passData.content.type = 'svg';
    passData.content.data = pfp.masks.outputConverted + '/' + pfp.itemCombinationPassName + '.png';
  } else if (pass.type == 'screen_coords') {
    passData.content.type = 'coords';
    passData.content.data = pythonData;
  }

  return passData;
}

// Figma Notation to JsonSplit
export function createJsonSplitFromFigmaNotation(ItemsData_forJsonSplit) {
  /* 
  Входящие данные: ItemsData_forJsonSplit, внутри него:
  - array of items
  - each item has: name, content {type, data}

  1/ для каждого пасса ItemsData 

  1.Add Data (image, screen_coords, svg):
  - найти нужную figmaNotation по grp и material
  - рекурсивно пройти по children, при совпадении name (passOutputName)
    добавить поле data
  
  2.Нарезать JsonSplit на скачиваемые файлы
      1) 

   */
  ItemsData_forJsonSplit;
}

// CRUD for passes
export function getPassDbEntry() {
  //
}
export function writePassDbEntry() {
  //
}
export function deletePassDbEntry() {
  //
}
export function updatePassDbEntry() {
  //
}
