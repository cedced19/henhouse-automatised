var express = require('express');
var passport = require('passport');
var suncalc = require('suncalc');
var router = express.Router();
var auth = require('../policies/auth.js');
var fs = require('fs');
var join = require('path').join;
var toggle = require('../lib/toggle.js');

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
    var capTime = new Date(sunset);
    capTime.setHours(20, 0, 0, 0); // 20:00:00
    sunset = (sunset > capTime) ? capTime : sunset;
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

function statusRoute (req, res, next) {
  fs.readFile(join(__dirname, '../status.json'), function (err, data) {
    if (err) {
      err = new Error('Cannot get the current status ot the door.');
      err.status = 500;
      return next(err);
    }
    var position = JSON.parse(data).position;
    res.json({
      position: position,
      closed: (position == 'up') ? false : true
    });
  });
}

function toggleRoute (req, res, next) {
  toggle(function (err, status) {
    if (err) {
      res.json({position: 'error', toggling: false});
    } else {
      res.json({position: status, toggling: true});
    }
  });
} 

/* GET Informations */
router.get('/api/door', auth, statusRoute);

/* GET Open/Close door */
router.get('/api/door/toggle', auth, toggleRoute);

/* Gate API Garage-doors-opener */
router.get('/garage/1/toggle/' + process.env.TOKEN_KEY, toggleRoute);
router.get('/garage/1/status/' + process.env.TOKEN_KEY, statusRoute);


module.exports = router;
