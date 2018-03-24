
const _ = require('lodash');
const fs = require('fs');
const resolve = require('path').resolve;
const relative = require('path').relative;
const glob = require('glob');
const imports = _.clone(require('./templateHelpers'));

const rootDir = resolve(__dirname, '..');
const apiDir = resolve(rootDir, '../../../../../../elasticsearch/x-pack/shield/src/test/resources/rest-api-spec/api');
const tmplDir = resolve(rootDir, 'generate/templates');
const apiFile = resolve(rootDir, 'elasticsearch-shield.js');
const docFile = resolve(rootDir, 'docs/api.asciidoc');

const read = function (filename) { return fs.readFileSync(filename, 'utf8'); };
const parseJson = function (contents) { return JSON.parse(contents); };
const Method = require('./Method');
const methods = glob
  .sync(resolve(apiDir, 'shield.*.json'))
  .map(read)
  .map(parseJson)
  .map(function (spec) {
    const name = Object.keys(spec).shift();
    return new Method(name, spec[name]);
  });

glob.sync(resolve(tmplDir, '*.tmpl')).forEach(function (filename) {
  const file = relative(tmplDir, filename);
  const name = file.replace(/\.tmpl/, 'Tmpl');
  let tmpl;
  imports[name] = function (locals) {
    tmpl || (tmpl = _.template(read(filename), { sourceURL: filename, imports: imports }));
    return tmpl(locals);
  };
});

fs.writeFileSync(apiFile, imports.apiFileTmpl({ methods: methods }));
fs.writeFileSync(docFile, imports.docFileTmpl({ methods: methods }));
