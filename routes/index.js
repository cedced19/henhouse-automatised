var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res, next) {
  var config = require('../configuration.json');
  if (config.users.length == 0) {
    res.redirect('/users/new');
  } else if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    res.render('index');
  }
});

/* GET login page */
router.get('/login', function(req, res) {
    res.locals.message = req.flash('message');
    res.render('login');
});

/* GET login */
router.post('/login', passport.authenticate('local', {
    failureRedirect : '/login',
		failureFlash : true
}), function(req, res) {
    res.redirect('/');
});

/* GET logout */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
