var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require('i18n-express');
var compression = require('compression');
var minifyTemplate = require('express-beautify').minify;
var minifyCSS = require('express-minify');

var passport = require('passport');
var flash = require('connect-flash');
var helmet = require('helmet');
var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users-api');
var door = require('./routes/door-api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(compression());
  app.use(minifyTemplate());
  app.use(minifyCSS());
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'),
  cookieLangName: 'language',
  paramLangName: 'lang',
  siteLangs: ['en','fr']
}));

app.use(helmet());
app.use(flash());
app.use(session({
    secret: 'open the door to the chickens',
    name: 'henhouse-automatised-session',
    proxy: false,
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({
      uri: 'mongodb://localhost:27017/henhouse-automatised',
      collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/api/door', door);

var getUser = function (config, email) {
  for (var i in config.users) {
    if (config.users[i].email == email)  {
      return config.users[i];
    }
  }
  return false;
};

var hash = require('password-hash-and-salt');

// authentication
passport.serializeUser(function(user, done) {
      done(null, user.email);
});

passport.deserializeUser(function(email, done) {
      var config = require('./configuration.json');
      var user = getUser(config, email);
      done(null, {email: user.email});
});

// define local strategy
passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
},
function(req, email, password, done) {
        // search in database
        var config = require('./configuration.json');
        var user = getUser(config, email);
        if (!user) {
          return done(null, false, req.flash('message', 'invalid-email'));
        }
        hash(password).verifyAgainst(user.password, function(err, verified) {
          if(err || !verified) {
            return done(null, false, req.flash('message', 'invalid-password'));
          } else {
            return done(null, {email: email});
          }
        });
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  var code = (err.status || 500);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.code = code;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // render the error page
  res.status(code);
  res.render('error');
});

module.exports = app;
