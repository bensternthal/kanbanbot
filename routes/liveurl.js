var kanbanery = require('../lib/kanbanery');
var ircUtils = require('../lib/irc');
var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

exports.index = function(req, res){
    
    // Authenticate Request
    //this is a messy conrtoller.. refactor out each function
    kanbanery.auth(req, nconf, function(err, valid) {
      if (err || !valid) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.end(err); 
      } else {
        // Send response & process in background
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end('kanban!'); 

        // Get Column Information  & Post To IRC          
        kanbanery.get(req.body.resource.column_id, 'columns', nconf, function(err, response) {
          if (err || !response) {
            console.log('Error fetching column info via API:' + err);
          } else {
            ircUtils.cardMoved(req, response);
            var wip = response.capacity;
            var columnName = response.name;

            // calculate wip limit and alert
            kanbanery.getCardCount(req.body.resource.column_id, nconf, function(err,response){
              if (err || !response) {
                console.log('Error fetching WIP' + err);
              } else {
                if(response.length > wip ) {
                  //todo handle null
                  ircUtils.WIPExceeded(response.length, wip, columnName);
                }
              }

            });
          }
        });       
      }
    });
};


// We need to return 200 even for calls we do not use. 
// Kanbanery will eventually disable the live url if you return 404
exports.notImplemented = function(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end('Not Implemented'); 
};



