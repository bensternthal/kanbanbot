var kanbanery = require('../lib/kanbanery');
var ircUtils = require('../lib/irc');
var async = require('async');

module.exports = function(nconf, app) {

  app.put('/liveurl', function(req, res) {
    var wip;
    var columnName;

    async.series([
      function(callback) {
        // Authenticate
        kanbanery.auth(req, nconf, function(err, valid) {
          if (err || !valid) return callback(err);
          // Send response & process in background
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('kanban!');           
          callback();
        });
      },
      function(callback) {
        // Get Column Information  & Post To IRC   
        kanbanery.get(req.body.resource.column_id, 'columns', nconf, function(err, response) {
          if (err || !response) {
            console.log('Error fetching column info via API:' + err);
            return callback(err);
          }

          wip = response.capacity;
          columnName = response.name;
          
          ircUtils.cardMoved(req, response);
          callback();
        });
      },
      function(callback) {  
        kanbanery.getCardCount(req.body.resource.column_id, nconf, function(err,response) {
          if (err || !response) {
            console.log('Error fetching WIP' + err);
            return callback(err);
          }

          if(response.length > wip ) {
            //todo handle null
            ircUtils.WIPExceeded(response.length, wip, columnName);
          }
        });
      }
    ],
    // optional callback
    function(err){
      console.log(err);    
    });    

  });

  // We need to return 200 even for calls we do not use. 
  // Kanbanery will eventually disable the live url if you return 404
  app.post('/liveurl', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Not Implemented'); 
  });

  app.delete('/liveurl', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Not Implemented'); 
  });  

};





