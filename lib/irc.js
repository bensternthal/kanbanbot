'use strict';

var irc = require('irc');
var client;
var channel = '#bentest' // TODO: change this so it's read from conf and supports multiple channels

exports.startClient = function(nconf) {
  client = new irc.Client(nconf.get('irc:server'), nconf.get('irc:botName'), nconf.get('irc:config'));

  client.addListener('error', function(message) {
    console.log('error: ', message);
  });  

  this.defaultListeners();
};

exports.cardMoved = function(cardData, columnData) {
  var message = 'Card: '  + cardData.body.resource.title + ' was moved to: ' + columnData.name;
  client.say(channel, message);
};

exports.WIPExceeded = function(currentNumber, capacity, columnName) {
  var message = 'WIP Exceeded in Column: ' + columnName + ' - ' + currentNumber + ' / ' + capacity;
  client.say(channel, message);
};

// All the usual things go here, help, list commands
exports.defaultListeners = function() {
  var self = this;
  
  // Default help message
  client.addListener('message', function(from, to, text, message) {    
    if(to == 'kanbanbot') {
      client.say(from, 'I am a kanbanery bot and don\'t do much yet.');
    }
  });

  // Listen for card url
  client.addListener('message', function(from, to, text, message) {
    var ircChannel = message.args[0];
    var messageString = message.args[1];

    if(self.findKBURL(messageString)) {
      client.say(ircChannel, 'I have found a kanbanery url');      
    }    
  });  

  self.findKBURL = function(message) {
    var regexp = /^(?=.*\bkanbanery\b)(?=.*\bprojects\b)(?=.*\bboard\b)(?=.*\btasks\b).*$/g;

    if(message.search(regexp) != -1) {
      return true;
    } else {
      return false;
    }
  };

};