'use strict';

var irc = require('irc');
var url = require('url');
var kanbanery = require('../lib/kanbanery');
var client;
var channel = '#bentest'; // TODO: change this so it's read from conf and supports multiple channels

exports.startClient = function(nconf) {
  
  // Start Client
  client = new irc.Client(nconf.get('irc:server'), nconf.get('irc:botName'), nconf.get('irc:config'));

  client.addListener('error', function(message) {
    console.log('error: ', message);
  });  

  // Init listeners
  this.cardMentioned();
  this.help();

};

exports.cardMoved = function(cardData, columnData) {
  var message = 'Card: '  + cardData.body.resource.title + ' was moved to: ' + columnData.name;
  client.say(channel, message);
};

exports.WIPExceeded = function(currentNumber, capacity, columnName) {
  var message = 'WIP Exceeded in Column: ' + columnName + ' - ' + currentNumber + ' / ' + capacity;
  client.say(channel, message);
};

exports.help = function() {
  client.addListener('message', function(from, to, text, message) {    
    if(to == 'kanbanbot') {
      client.say(from, 'I am a kanbanery bot and don\'t do much yet.');
    }
  });
};

exports.cardMentioned = function() {
  var self = this;

  client.addListener('message', function(from, to, text, message) {
    var ircChannel = message.args[0];
    var messageString = message.args[1];

    if(self.findCardMention(messageString)) {
      // This is a pretty dumb regex
      var params = messageString.match(/\d+/g);
      var cardID = params[1];

      // Lookup from kanbanery and post info
      kanbanery.getCardColumn(cardID, function(err, response) {
        if (err || !response) {
          console.log("me" + err);
          client.say(channel, 'Error.. awww: ' + err);
        } else {
          var card = response[0];
          var column = response[1];
          
          client.say(channel, card.title + " :: Column: " + column.name + " :: Blocked: " + card.blocked);
        }
      });          
    }    
  });  
};

exports.findCardMention = function (message) {
  var regexp = /^(?=.*\bkanbanery\b)(?=.*\bprojects\b)(?=.*\bboard\b)(?=.*\btasks\b).*$/g;
  
  if(message.search(regexp) != -1) {
    return true;
  } else {
    return false;
  }  
};
