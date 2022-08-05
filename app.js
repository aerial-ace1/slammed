var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressValidator = require('express-validator')
var expressSession = require('express-session')
var hbs = require('express-handlebars');
var db = require('./routes/db.js')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment')
var searchRouter = require('./routes/search')

var app = express();

// view engine setup
app.engine('hbs', hbs.engine({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Change secret in session
app.use(expressSession({secret: 'abc123',saveUninitialized: false, resave: false}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comment', commentRouter)
app.use('/search', searchRouter)

db.startup();
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message)
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
