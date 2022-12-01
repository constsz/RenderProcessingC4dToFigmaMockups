// Modules
import * as utl from './utils/helperFunctions.js';
import { imageProcessing } from './processing/imageProcessing.js';
import { createFrontendThumbnails } from './processing/createFrontendThumbnails.js';
import { setPhotoshopBusy, moveScreenCoordsFiles, getItemCombinationName } from './dataManipulation/filesystem.js';
import * as model from './dataManipulation/model.js';
import { preNotationConcat, createPassData } from './dataManipulation/internalData.js';
/* 

  SOURCES OF INFORMAION:
    - initSettings
    - c4d_db

*/

export async function ProcessingRouter(initSettings, menuSelectedStep) {
  // get data
  const c4d_db = utl.readJsonDb(initSettings.rendersFolder, initSettings.c4d_db_name);
  const recipes = preNotationConcat(initSettings.recipes);
  const figmaNotation = initSettings.figmaNotation;

  setPhotoshopBusy('false', initSettings);

  // создаем эти переменные тут заранее, чтобы при первом запуске отправить пустые переменные,
  // при последующих запусках они будут уже заполненные и только обновляться
  let Family;
  let Item;

  // arrays для заполнения
  let promises = [];
  const familyItems = [];
  const ItemsData_forJsonSplit = [];

  // MENU SELECT - Skip or Start?
  if (menuSelectedStep == 0) {
    // WORK
    // 🛢️ STAGE 1 : Process Renders and screen coords
    // start
    // <🧿> Item

    for (let item of c4d_db.items) {
      // <🧿> Material

      for (let material of c4d_db.materials) {
        // check if ignore material (special)
        if (!initSettings.ignoreSpecialMaterials.includes(material)) {
          const materialEntity = {
            name: material,
            code: material,
          };

          // <🧿> Camera
          for (let camera of c4d_db.cameras) {
            const cameraEntity = {
              name: camera.name,
              code: camera.name,
            };

            // <🧿> pose_grp
            let pose = item.poses.find((p) => p.pose_int == item.cam_poses[camera.name]);

            for (let pose_grp of pose.pose_grps) {
              // Get recipe by pose_grp number (if no recipe - skip)
              let grp_number = utl.getNumberFromString(pose_grp);
              const recipe = recipes.find(({ grp, material }) => grp.includes(grp_number) && material == materialEntity.name);

              if (recipe) {
                const edition = initSettings.grpSpecs[grp_number];
                // -- Create ItemData entity
                const itemDataEntity_forJsonSplit = {
                  name: getItemCombinationName(item, material, camera, grp_number, null),
                  passes: [],
                };

                // -- Create DB entities
                // Family entity - update
                Family = model.createFamilyEntity(Family, item, materialEntity, cameraEntity, edition, initSettings);
                // Add Item to list of familyItems
                familyItems.push(model.createItemEntity(Item, Family.name, item, materialEntity, cameraEntity, edition));
                // <🧿> IMAGE PROCESSING
                // move screen_coords renders in place
                await moveScreenCoordsFiles(item, material, camera, grp_number, recipe, initSettings);

                // image processing
                for (let pass of recipe.notation) {
                  const imageProcessingResponse = await imageProcessing(item, material, camera, grp_number, pass, initSettings);
                  const passData = createPassData(imageProcessingResponse);

                  itemDataEntity_forJsonSplit.passes.push(passData);

                  promises.push(imageProcessingResponse);
                  // promises.push(Promise.resolve()); // to skip imageProcessing
                }
                ItemsData_forJsonSplit.push(itemDataEntity_forJsonSplit);
              }
            } // ./ loop : pose_grp
          } // ./ loop : camera
        }
      } // ./ loop : material
    } // ./ loop : item
  }
  // if MENU selected to Skip this step
  else {
    promises.push(Promise.resolve());
  }

  if (menuSelectedStep <= 1) {
    return (
      Promise.all(promises)
        // 🛢️ STAGE 2 : Process Masks
        .then(
          () => {
            console.dir(ItemsData_forJsonSplit, { depth: null });
            // console.dir(Family, { depth: null });
            // console.dir(familyItems, { depth: null });
            null;
          }
          // print info about vector magic, while await createFrontendThumbnails()
          // utl.cmdAskUserInputYes(
          //   '👍 Now open VectorMagic and process masks...\n- change output path to ./converted\n-choose dxf-mode: larger file'
          // )
        )
        // Pass Data to UploadingRouter
        .then(() => {
          let dataObjectForUploadingRouter = {
            Family,
            familyItems,
          };
          // console.dir(dataObjectForUploadingRouter, { depth: null });
        })
        .catch((e) => {
          console.log(e);
          console.log('(!) MEGA ERROR on Promise.all');
        })
    );
  } else {
    return;
  }
}
