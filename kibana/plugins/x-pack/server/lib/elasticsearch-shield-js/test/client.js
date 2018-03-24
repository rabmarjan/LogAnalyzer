const es = require('elasticsearch');
const Promise = require('bluebird');

// current client
let client = null;

module.exports = {
  create: function create(port) {
    doCreateClient({ logConfig: null });
    let attemptsRemaining = 60;
    const timeout = 500;

    return (function ping() {
      return client.info({
        maxRetries: 0
      })
        .then(
          function (resp) {
            if (resp.name !== 'esjs-shield-test-runner') {
              throw new Error('Almosted wiped out another es node. Shut-down all instances of ES and try again.');
            }

            // create a new client
            doCreateClient();
            return client;
          },
          function (err) {
            if (err && --attemptsRemaining) {
              return Promise.delay(timeout).then(ping);
            }

            throw new Error('unable to establish contact with ES at ' + JSON.stringify({
              host: 'localhost',
              port: port,
              err: err
            }));
          }
        );
    }());

    function doCreateClient() {
      // close existing client
      if (client) client.close();

      client = new es.Client({
        hosts: [
          {
            host: 'localhost',
            port: 9200
          }
        ],
        plugins: [ require('../') ],
        pingTimeout: 5000,
        log: false
      });

      client.clearEs = function () {
        return Promise.all([
          client.indices.delete({ index: '*', ignore: 404 }),
          client.indices.deleteTemplate({ name: '*', ignore: 404 })
        ]);
      };
    }
  },

  get: function () {
    return client;
  }
};
