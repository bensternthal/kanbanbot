'use strict';

var request = require('request');

// types = tasks, columns
exports.get = function(id, type, nconf, callback) {
  var kbURL = nconf.get('kanbanery_url') + type + '/' + id + '.json?api_token=' + nconf.get('kanbanery_api_token') ;
  
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

exports.auth = function(req, nconf, callback) {
  if(nconf.get('kanbanery_auth_token') === req.body.auth_token) {
    callback(null, true);
  } else {
    callback('Invalid Credentials');
  }
};