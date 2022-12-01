export async function UploadingRouter(dataObject) {
  // 🛢️ STAGE 3 : Upload

  // 3.1 JSON Split
  // console.log('JSON Split : - convert images to base64, include in "object"');
  // console.log('JSON Split : - convert SVG masks to paste them in "object"');
  // console.log('JSON Split : - upload to vps');

  // 3.2 Previews, thumbnails
  // console.log('upload thumbnails-previews to cdn');

  // 3.3 MongoDb
  if (dataObject) {
    console.dir(dataObject, { depth: null });
    console.log('<🧿> <🧿> <🧿> write items to Mongo DB');
    // const dbResult = model.writeNewItems(processingDb);
  } else {
    return Promise.reject();
  }

  process.exit();
}
