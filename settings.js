'use strict';

// Module dependencies.
module.exports = function(app, configurations, express) {
  var nconf = require('nconf');

  nconf.argv().env().file({ file: 'local.json' });

  // Configuration


  return app;
};
