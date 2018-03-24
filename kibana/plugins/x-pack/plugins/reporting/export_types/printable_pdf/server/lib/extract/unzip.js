import extractZip from 'extract-zip';
import { ExtractError } from './extract_error';

export function unzip(filepath, target) {
  return new Promise(function (resolve, reject) {
    extractZip(filepath, { dir: target }, (err) => {
      if (err) {
        return reject(new ExtractError(err));
      }

      resolve();
    });
  });
}
