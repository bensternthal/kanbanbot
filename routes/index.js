
/*
 * GET home page.
 */

var qs = require('querystring');

exports.index = function(req, res){
  res.render('index', { title: 'Test Form Page' });
};