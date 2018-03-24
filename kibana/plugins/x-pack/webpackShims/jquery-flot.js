const $ = require('jquery');
if (window) { window.jQuery = $; }
require('flot-charts/jquery.flot');

// load flot plugins
// avoid the `canvas` plugin, it causes blurry fonts
require('flot-charts/jquery.flot.time');
require('flot-charts/jquery.flot.crosshair');
require('flot-charts/jquery.flot.selection');
module.exports = $;
