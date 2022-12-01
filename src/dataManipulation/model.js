// Modules
import * as utl from '../utils/helperFunctions.js';

// schemas
export const schemaItemData = {
  name: '',
  specs: {
    type: '',
    editions: [],
    materials: [],
    cameras: [],
  },
  family: {
    name: '',
    id: null,
  },
  price: [],
  dataStorage: {
    img_detail: 'cdn_url:',
    img_thumb_s: 'cdn_url:',
    img_thumb_m: 'cdn_url:',
    downloadFolder: 'folder_url:',
  },
};

export function createFamilyEntity(passedFamily, item, materialEntity, cameraEntity, edition, initSettings) {
  // initialize variable
  let Family;

  // при первом запуске сюда попадает нулевая переменная, только созданная,
  // при следующих запусках уже передается заполненная переменная
  // check if input Family data exists
  if (passedFamily) {
    Family = passedFamily;
  } else {
    Family = {
      name: utl.capitilizeFirstLetters(initSettings.familyName),
      specs: {
        types: [],
        editions: [],
        materials: [],
        cameras: [],
      },
    };
  }

  // add itemType to DB object: Check if exists, if not - push new item
  if (!Family.specs.types.find((type) => type == item.type)) {
    Family.specs.types.push(item.type);
  }

  // add Material to DB object: Check if exists, if not - push new material
  if (!Family.specs.materials.find(({ name }) => name == materialEntity.name)) {
    Family.specs.materials.push(materialEntity);
  }

  // add Camera to DB object: Check if exists, if not - push new camera
  if (!Family.specs.cameras.find(({ name }) => name == cameraEntity.name)) {
    Family.specs.cameras.push(cameraEntity);
  }

  // add Edition to DB Object: Check if exists, if not - push new edition
  if (!Family.specs.editions.find(({ code }) => code == edition.code)) {
    Family.specs.editions.push(edition);
  }

  return Family;
}

export function createItemEntity(passedItem, familyName, item, materialEntity, cameraEntity, edition) {
  // initialize variable
  let Item;

  // check if input Family data exists
  if (passedItem) {
    Item = passedItem;
  } else {
    Item = {
      name: utl.capitilizeFirstLetters(item.name),
      familyName,
      specs: {
        types: item.type,
        editions: [],
        materials: [],
        cameras: [],
      },
    };
  }

  // Append Material to DB object: Check if exists, if not - push new camera
  if (!Item.specs.materials.find(({ name }) => name == materialEntity.name)) {
    Item.specs.materials.push(materialEntity);
  }

  // Append Camera to DB object
  if (!Item.specs.cameras.find(({ name }) => name == cameraEntity.name)) {
    Item.specs.cameras.push(cameraEntity);
  }

  // Append Edition to DB Object
  if (!Item.specs.editions.find(({ code }) => code == edition.code)) {
    Item.specs.editions.push(edition);
  }

  return Item;
}

// export function createItemEntity(Family, item, materialEntity, cameraEntity, edition) {
//   let itemData = { ...schemaItemData };
//   itemData.name = item.name;
//   itemData.specs.type = item.type;
//   itemData.specs.editions.push(edition);
//   itemData.specs.materials.push(materialEntity);
//   itemData.specs.cameras.push(cameraEntity);
//   itemData.family.name = Family.name;
//   return itemData;
// }

export function writeNewItems(processingDb) {
  return processingDb;
}
