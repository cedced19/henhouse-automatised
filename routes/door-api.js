var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var fs = require('fs');
var join = require('path').join;
var toggle = require('../lib/toggle.js');

/* GET Informations */
router.get('/', auth, function(req, res, next) {
  fs.readFile(join(__dirname, '../status.json'), function (err, data) {
    if (err) {
      err = new Error('Cannot get the current status ot the door.');
      err.status = 500;
      return next(err);
    }
    res.json({
      position: JSON.parse(data).position
    });
  });
});

/* GET Open/Close door */
router.get('/toggle', auth, function(req, res, next) {
    toggle(function (err, status) {
      if (err) {
        err = new Error('Cannot move the door.');
        err.status = 500;
        return next(err);
      }
      res.json({
        position: status
      });
    });
});


module.exports = router;
