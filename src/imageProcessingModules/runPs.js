import { exec, execFile, spawn, spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

import { setPhotoshopBusy, checkPhothoshopBusy } from '../dataManipulation/filesystem.js';

export async function run(pass, pathsForPass, initSettings) {
  // 1. open the input image
  // 2. do steps of processing
  // 3. save and close

  return new Promise((resolve, reject) => {
    const PhotoshopPing = setInterval(() => {
      let busy = checkPhothoshopBusy(initSettings);

      if (busy != 'true') {
        setPhotoshopBusy('true', initSettings); // when Finished - JSX script writes "false"
        console.log('WORKING');
        clearInterval(PhotoshopPing);

        const commands = JSON.stringify({
          pass,
          pathsForPass,
        });

        fs.writeFileSync(path.resolve('./recipes/_exchange/executePhotoshop.json'), commands);

        spawnSync('C:/Program Files (x86)/Adobe/Adobe ExtendScript Toolkit CC/ExtendScript Toolkit.exe', [
          '-run',
          'C:/Users/kosty/Documents/Adobe Scripts/node_render2app/main.jsx',
        ]);

        const scriptPing = setInterval(() => {
          busy = checkPhothoshopBusy(initSettings);

          if (busy != 'true') {
            clearInterval(scriptPing);
            console.log('SCRIPT FINISHED');
            resolve();
          } else {
            // console.log('script still running .... ');
          }
        }, 500);
      } else {
        // console.log('trying ... ');
      }
    }, 500);
  });
}
