/* global describe, before */
const resolve = require('path').resolve;
const glob = require('glob');
const jsYaml = require('js-yaml');
const readFile = require('fs').readFileSync;
const relative = require('path').relative;

const YamlFile = require('./YamlFile');
const client = require('./client');

const port = parseFloat(process.env.ES_PORT || 9200);
const testDir = resolve(__dirname, '../../x-plugins/elasticsearch/x-pack/shield/src/test/resources/rest-api-spec/test');

describe('', function () {
  this.timeout(30000);

  // before running any tests...
  before(function () {
    this.timeout(5 * 60 * 1000);
    return client.create(port)
      .then(function () {
      // make sure ES is empty
        return client.get().clearEs();
      });
  });

  const files = glob.sync(resolve(testDir, '**', '*.yaml'));
  files.map(function (filename) {
    const docs = [];

    jsYaml.safeLoadAll(readFile(filename), function (doc) {
      docs.push(doc);
    });

    const relName = relative(testDir, filename);
    // console.log(relName, docs);
    return new YamlFile(relName, docs);
  });
});
