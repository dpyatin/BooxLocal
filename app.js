
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var message = require('./routes/message');
var book = require('./routes/book');
var ad = require('./routes/ad');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'y0l0sw4g',
  store: new express.session.MemoryStore
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/user', user.find); // check if user exists
app.get('/FBLogin', user.FBLogin);
app.get('/message', message.find);
app.get('/ad', ad.find);
app.get('/book', book.find);
app.get('/books', book.fetchAll);

app.post('/user', user.createUser);
app.post('/message', message.postMessage);
app.post('/book', book.add);
app.post('/ad', ad.postAd);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
