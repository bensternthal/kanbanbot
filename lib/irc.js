'use strict';

var irc = require('irc');
var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

var client = new irc.Client(nconf.get('irc:server'), nconf.get('irc:botName'), nconf.get('irc:config'));

// types = tasks, columns
exports.startClient = function(nconf) {
  client.addListener('error', function(message) {
    console.log('error: ', message);
  });  
};

exports.cardMoved = function(cardData, columnData) {
  var message = "Card: '" + cardData.body['resource[title]'] + "' was moved to: " + columnData.name;
  client.say("#bentest", message);
};

