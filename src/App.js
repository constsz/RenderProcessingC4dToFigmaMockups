import { ProcessingRouter } from './ProcessingRouter.js';
import { UploadingRouter } from './UploadingRouter.js';
import { showConsoleMenu } from './utils/helperFunctions.js';

// user preferences
import { initSettings } from '../recipes/init_settings/settings_hands.js';

console.clear();

// Menu: Select processing step
const menuSelectedStep = process.argv[2];

if (menuSelectedStep) {
  ProcessingRouter(initSettings, menuSelectedStep)
    .then((dataObject) => UploadingRouter(dataObject, menuSelectedStep))
    .catch((e) => {
      console.log('\n    Something went wrong');
      console.log(e);
    });
}
//
else {
  showConsoleMenu();
}
