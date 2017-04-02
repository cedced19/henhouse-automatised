var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');
var fs = require('fs');
var hash = require('password-hash-and-salt');
var config = require('../configuration.json');

var getUser = function (email) {
  for (var i in config.users) {
    if (config.users[i].email == email) {
      return {user: config.users[i], key: i };
    }
  }
  return false;
};

var saveConfiguration = function (cb) {
  fs.writeFile('./configuration.json', JSON.stringify(config), cb);
};

/* GET Users: get all users */
router.get('/', auth, function(req, res) {
    res.locals.users = config.users;
    res.render('users-list');
});

/* GET Delete user: delete an user */
router.get('/delete/:email', auth, function(req, res) {
    if (req.user.email == req.params.email) {
      res.locals.success = 'user-not-deleted';
      res.render('success-page');
    } else {
      var user = getUser(req.params.email);
      config.users.splice(user.key, 1);
      saveConfiguration(function (err) {
        if (err) {
          err = new Error('Error deleting the user.');
          err.status = 500;
          return next(err);
        }
        res.locals.success = 'user-deleted';
        res.render('success-page');
      });

    }
});

/* GET New user: create new account */
router.get('/new/', auth, function(req, res) {
    res.locals.connected = (config.users.length == 0);
    res.render('new-account');
});

/* POST New user: save new user */
router.post('/new/', auth, function(req, res, next) {
    if (!getUser(req.body.email)) {
      hash(req.body.password).hash(function(err, hash) {
        config.users.push({
          password: hash,
          email: req.body.email
        });
        saveConfiguration(function(err) {
            if(err) {
              err = new Error('Error saving the new user.');
              err.status = 500;
              return next(err);
            }
            res.locals.success = 'user-saved';
            res.render('success-page');
        });
      });
    } else {
      var err = new Error('Email already exists.');
      err.status = 400;
      return next(err);
    }
});

module.exports = router;
