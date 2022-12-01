import { exec, spawn, spawnSync } from 'child_process';

export function findScreenCoords(sysArg) {
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['./python/find_coords.py', sysArg]);
    process.stdout.setEncoding('utf8');
    process.stdout.on('data', (data) => {
      if (data) {
        return resolve(JSON.parse(data));
      } else {
        return reject();
      }
    });
  });
}
