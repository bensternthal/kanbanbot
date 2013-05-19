var kanbanery = require('../lib/kanbanery');
var ircUtils = require('../lib/irc');
var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

exports.index = function(req, res){

    // Authenticate Request
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
            console.log('something shitty:' + err);
          } else {
            //post to irc
            ircUtils.cardMoved(req, response);

          }
        });       
      }
    });
};



