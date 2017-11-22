var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 公用库
global._ = require('lodash');
global.Util = require('./util/util.js');
global.Status = require('./util/status.js');
global.mongoose = require('mongoose');
global.mongoose.Promise = require('bluebird');
global.mongoose.connect('mongodb://127.0.0.1:27017/test', { useMongoClient: true });

var index = require('./routes/index');
var news = require('./routes/news');

var app = express();
// const csp = require(`helmet-csp`)
// app.use(csp({
//     directives: {
//         imgSrc: [`www.moremorewin.net`],
//         upgradeInsecureRequests: true
//     }
// }))

//设置跨域访问

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Referrer");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,PATCH");
    //res.header("X-Powered-By","PleskLin");
    //res.header("Content-Type", "text/html;charset=utf-8");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('etag'); //avoid 304 error
//app.disable('view cache');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
