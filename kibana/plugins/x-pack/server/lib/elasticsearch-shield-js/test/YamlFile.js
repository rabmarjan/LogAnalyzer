/* global describe, it, beforeEach, afterEach */

/**
 * Class representing a YAML file
 * @type {[type]}
 */
module.exports = YamlFile;

const Promise = require('bluebird');
const YamlDoc = require('./YamlDoc');
const client = require('./client');
const _ = require('lodash');

function YamlFile(filename, docs) {
  const file = this;

  // file level skipping flag
  file.skipping = false;

  describe(filename, function () {
    beforeEach(function () {
      return client.get().watcher.start();
    });

    file.docs = _.map(docs, function (doc) {
      doc =  new YamlDoc(doc, file);
      if (doc.description === 'setup') beforeEach(runDoc(doc));
      else it(doc.description, runDoc(doc));
    });

    afterEach(function () {
      return client.get().clearEs();
    });
  });

}

function runDoc(doc) {
  return function docRunner() {
    const steps = _.pluck(doc._actions, 'testable');
    return Promise.resolve(steps).each(function (step) {
      return Promise.try(step);
    });
  };
}
