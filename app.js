
/**
 * Module dependencies.
 */

var irc = require('irc');
var nconf = require('nconf');
var http = require('http');
var url = require('url');
var kanbanery = require('./lib/kanbanery');

// Settings
nconf.argv().env().file({ file: 'local.json' });

// IRC Client
// var client = new irc.Client(nconf.get('irc:server'), nconf.get('irc:botName'), nconf.get('irc:config'));

// client.addListener('error', function(message) {
//     console.log('error: ', message);
// });


// http.createServer(function (req, res) {
//   var queryObject = url.parse(req.url,true).query;
//   res.writeHead(200, {"Content-Type": "text/plain"});
//   res.end();
//   //check if this blocks
//   processResponse(queryObject);
// }).listen(8000);

// // Async much?
// var processResponse = function(queryObject) {

//   kanbanery.queryCard(queryObject, function(err, response){
//     if (err || !response) {
//       console.log('something shitty:' + err);
//     } else {
//       //lets look up column
//       var cardData = response;
//       kanbanery.queryColumn(response, function(err, response){
//         postIRC(cardData, response);
//       })
//     }
//   });  
// }

// var postIRC = function(cardData, columnData) {
//   var message = "Ben Test - Card: '" + cardData.title + "' was moved to: " + columnData.name;
//   client.say("#firefoxflicks", message);
// }

// client.addListener("message", function(from, to, text, message) {
//   client.say("#bentest", "¿Public que?");
// });

// todo!
// get live update request
// do ajax call for particular info
// send to irc
// make sure everything is in the local.json
// make sure everything is not blocking
// live update is per project
// move irc crap out of here
// npm install forever -g




