
/**
 * Module dependencies.
 */
var nconf = require('nconf');
var express = require('express')
    , routes = require('./routes')
    , liveURL = require('./routes/liveurl'); 

var path = require('path');
var ircUtils = require('./lib/irc');
var app = express();

// Settings
nconf.argv().env().file({ file: 'local.json' });

// Using Express For Form Test & Routing Cause It's Easier
app.configure(function(){
    app.set('port', process.env.PORT || 8000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.favicon());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

app.use(express.errorHandler());    

// Routes!
app.get('/', routes.index);
app.put('/liveurl', liveURL.index);

var server = app.listen(8000);

// Start WebServer
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



