'use strict';

var request = require('request');
var nconf = require('nconf');

//TODO we are doubling up on nconfs
nconf.argv().env().file({ file: 'local.json' });

// type = tasks, columns
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