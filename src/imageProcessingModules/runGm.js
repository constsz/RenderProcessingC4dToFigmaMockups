import gm from 'gm';

export function invert(pass, pathsForPass) {
  const inputImagePath = pathsForPass.masks.input;
  let outputImagePath = pathsForPass.masks.outputRaster;

  return new Promise((resolve, reject) => {
    return gm(inputImagePath)
      .negative()
      .write(outputImagePath, (err) => {
        return resolve();
      });
  });
}
