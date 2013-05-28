'use strict';

var request = require('request');
var nconf = require('nconf');
var async = require('async');

//TODO we are doubling up on nconfs
nconf.argv().env().file({ file: 'local.json' });

// Get individual asset type = tasks, columns
exports.get = function(id, type, callback) {
  var kbURL = nconf.get('kanbanery_url') + type + '/' + id + '.json?api_token=' + nconf.get('kanbanery_api_token');

  request(kbURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      
      try {
        var jsonResp = JSON.parse(body);
        callback(null, jsonResp);   
      } catch (error) {
        callback(error);
      }     
    } else {
      return callback(error);
    }
  })

};

// Helper to Get card and column data id = card id
exports.getCardColumn = function(id, callback) {
  var columnID;
  var self = this;

  async.series([
    function(callback) {
      // Get Card Data    
      self.get(id, 'tasks', function(err, response) {
        if (err || !response) {
          return callback('Error fetching card info via API:' + err);
        }

        columnID = response.column_id;
        callback(null, response);
      });
    },
    function(callback) {
      // Get Column Data    
      self.get(columnID, 'columns', function(err, response) {
        if (err || !response) {
          return callback('Error fetching column info via API:' + err);
        }

        callback(null, response);
      });
    },
  ],
  // optional callback
  function(err, results){
    if(err) {
      callback(err); 
    } else {
      callback(null, results);
    }
  });

};


exports.auth = function(req, callback) {
  if(nconf.get('kanbanery_auth_token') === req.body.auth_token) {
    callback(null, true);
  } else {
    callback('Invalid Credentials');
  }
};

exports.getCardCount = function(id, callback) {
  var kbURL = nconf.get('kanbanery_url') + 'columns' + '/' + id + '/tasks.json?api_token=' + nconf.get('kanbanery_api_token');

  request(kbURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        var jsonResp = JSON.parse(body);
        callback(null, jsonResp);   
      } catch (error) {
        callback(error);
      }     
    } else {
      return callback(error);
    }
  })  

}