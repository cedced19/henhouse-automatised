var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');
var fs = require('fs');
var hash = require('password-hash-and-salt');
var users = require('../users.json');

var getUser = function (email) {
  for (var i in users) {
    if (users[i].email == email) {
      return {user: users[i], key: i };
    }
  }
  return false;
};

var saveUsers = function (cb) {
  fs.writeFile('./users.json', JSON.stringify(users), cb);
};

/* GET Users: get all users */
router.get('/', auth, function(req, res) {
    res.locals.users = users;
    res.render('users-list');
});

/* GET Delete user: delete an user */
router.get('/delete/:email', auth, function(req, res) {
    if (req.user.email == req.params.email) {
      res.locals.success = 'user-not-deleted';
      res.render('success-page');
    } else {
      var user = getUser(req.params.email);
      users.splice(user.key, 1);
      saveUsers(function (err) {
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
    res.locals.connected = (users.length == 0);
    res.render('new-account');
});

/* POST New user: save new user */
router.post('/new/', auth, function(req, res, next) {
    if (!getUser(req.body.email)) {
      hash(req.body.password).hash(function(err, hash) {
        users.push({
          password: hash,
          email: req.body.email
        });
        saveUsers(function(err) {
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
