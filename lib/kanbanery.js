'use strict';

var request = require('request');
var nconf = require('nconf');

nconf.argv().env().file({ file: 'local.json' });


exports.queryCard = function(query, callback) {
  console.log(nconf.get('irc:server'));

  // request('https://mozilla.kanbanery.com/api/v1/tasks/883227.json?api_token=c680866a535e9f9978aa40797d666100de8fcd51', function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     try {
  //       var jsonResp = JSON.parse(body);
  //       callback(null, jsonResp);   
  //     } catch (error) {
  //       callback(error);
  //     }     
  //   } else {
  //     return callback(error);
  //   }
  // })
};


exports.queryColumn = function(id, callback) {
  
  request('https://mozilla.kanbanery.com/api/v1/columns/191417.json?api_token=c680866a535e9f9978aa40797d666100de8fcd51', function (error, response, body) {
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

// card id
//  curl https://WORKSPACE.kanbanery.com/SOME_PATH?api_token=API_TOKEN 
// GET https://WORKSPACE.kanbanery.com/api/v1/tasks/TASK_ID.json 

//// curl https://mozilla.kanbanery.com/api/v1/tasks/883227.json?api_token=c680866a535e9f9978aa40797d666100de8fcd51 

// queryColum
// GET https://mozilla.kanbanery.com/api/v1/columns/COLUMN_ID.json 