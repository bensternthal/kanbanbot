
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
//var client = new irc.Client(nconf.get('irc:server'), nconf.get('irc:botName'), nconf.get('irc:config'));

//client.addListener('error', function(message) {
//    console.log('error: ', message);
//});


http.createServer(function (req, res) {

  //authenticate
  var queryObject = url.parse(req.url,true).query;
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end('I am here\n');
  //get id from liveupdate url
  console.log(queryObject);
  //processResponse(queryObject);
}).listen(8000);

// // Async much?
var processResponse = function(queryObject) {

// request { "user_id" => "7", "auth_token" => "4bd1ffc83e5ed9ac501c6d1729c8643c9022d452", "resource" => { "id" => "6", "title" => "Some task", ... } }
  kanbanery.get(883227, 'tasks', nconf, function(err, response){
    if (err || !response) {
      console.log('something shitty:' + err);
    } else {
      //lets look up column
      var cardData = response;
      console.log(response);
      //kanbanery.queryColumn(response, function(err, response){
        //postIRC(cardData, response);
      //})
    }
  });  
}

var postIRC = function(cardData, columnData) {
  var message = "Ben Test - Card: '" + cardData.title + "' was moved to: " + columnData.name;
  client.say("#firefoxflicks", message);
}

// todo!
// get live update request
// do ajax call for particular info
// send to irc
// make sure everything is in the local.json
// make sure everything is not blocking
// live update is per project
// move irc crap out of here
// npm install forever -g




