var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Twitter = require('twitter');
var dotenv = require('dotenv');
dotenv.load();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_SECRET
});

io.on('connection', function(socket){
	client.get('trends/place', {id: 23424977}, function(error, data, response){
		//rate limiting is 15 calls for 15 minutes!
		if(error)
			socket.emit('error', error);

		var trendList = data[0].trends;
		var trackList = [];
		for(var i=0; i < 10; i++){
			trackList.push(trendList[i].name);
		}
		client.stream('statuses/filter', {track: trackList.toString() }, function(stream){
			stream.on('data', function(tweet) {
				socket.emit('tweet', tweet);
			});
			stream.on('error', function(error){
				if (!error)
					socket.emit('tweet', tweet);
			});
		});
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

http.listen(3000);
module.exports = app;

