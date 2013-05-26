
/**
 * Module dependencies.
 */
var nconf = require('nconf');
var express = require('express')
    , routes = require('./routes')
    , liveURL = require('./routes/liveurl'); 
var app = express();

var path = require('path');
var ircUtils = require('./lib/irc');

// Settings
nconf.argv().env().file({ file: 'local.json' });

// Using Express For Now Cause It's Easier
app.configure(function(){
    app.set('port', process.env.PORT || 8000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    //app.use(express.methodOverride());
    app.use(express.favicon());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

app.use(express.errorHandler());    

// Routes
app.get('/', routes.index);
require('./routes/liveurl')(nconf, app);


// Start WebServer
app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Start IRC Bot
ircUtils.startClient(nconf);



