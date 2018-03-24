import Promise from 'bluebird';
import glob from 'glob';
import { isFunction } from 'lodash';

export function requireAllAndApply(path, server) {
  return new Promise(function (resolve, reject) {
    glob(path, { ignore: '**/__tests__/**' }, function (err, files) {
      if (err) return reject(err);
      const modules = files.map(require);
      modules.forEach(function (imports) {
        const importedSymbols = Object.keys(imports);
        if (importedSymbols.length > 1) {
          return reject('Module must export only one symbol');
        }

        const fn = imports[importedSymbols[0]];
        if (!isFunction(fn)) {
          return reject('Exported symbol must be a function');
        }

        fn(server);
      });
      resolve(modules);
    });
  });
}
