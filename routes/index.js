var express = require('express');
var passport = require('passport');
var router = express.Router();
var suncalc = require('suncalc');

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

/* GET home page */
router.get('/', function(req, res, next) {
  var users = require('../users.json');
  if (users.length == 0) {
    res.redirect('/users/new');
  } else if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    var sunset = addMinutes(suncalc.getTimes(new Date(), process.env.COORDS_LAT, process.env.COORDS_LNG).sunset, process.env.MARGIN_MIN);
    res.render('index', {sunset: sunset.getHours() + ':' + ((sunset.getMinutes()<10) ? '0': '') + sunset.getMinutes()});
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
