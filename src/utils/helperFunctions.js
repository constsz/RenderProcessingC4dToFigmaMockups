// IMPORTS
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// STRINGS
export function getNumberFromString(string) {
  return RegExp(/(\d_?\d?)/).exec(string)[0];
}

export function capitilizeFirstLetters(str) {
  // split the above string into an array of strings
  // whenever a blank space is encountered

  const arr = str.split(' ');

  // loop through each element of the array and capitalize the first letter.
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  // Join all the elements of the array back into a string
  // using a blankspace as a separator
  const str2 = arr.join(' ');
  return str2;

  //Outptut: I Have Learned Something New Today
}

// APP LOGIC
export function readJsonDb(folderPath, fileName) {
  return JSON.parse(fs.readFileSync(path.join(folderPath, fileName)));
}

export function cmdAskUserInputYes(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    function prompt(question) {
      rl.question('\n' + question + '\n' + 'Write "y" once ready.\n', (reply) => {
        if (reply.toLowerCase() == 'y') {
          resolve('Whuuuuut?');
        } else {
          console.log('\nPlease try again!');
          prompt(question);
        }
      });
    }
    prompt(question);
  });
}

export function showConsoleMenu() {
  console.log('\x1b[0m');
  console.log('Welcome to render2app');
  console.log('\x1b[41m', '\x1b[37m', '(!) Please add argument to run');
  console.log('\x1b[0m');
  console.log(' - - - - - ');
  console.log();
  console.log('Menu: Select processing step');
  console.log('0 = start ProcessingRouter');
  console.log('1 = skip to confirming VectorMagic');
  console.log('2 = start UploadingRouter');
  console.log('3 = TBD');
  console.log('\x1b[0m');
}
