var express = require('express');
var router = express.Router();
var pkg = require('../package.json');
var checkUpdate = require('check-update-github');
var auth = require('../policies/auth.js');

/* GET Version */
router.get('/', auth, function(req, res, next) {
    checkUpdate({name: pkg.name, user: 'cedced19'}, function(err, latestVersion){
      if(err) return next(err);
      res.json({
          local: pkg.version,
          github: latestVersion,
          url: pkg.homepage + '/releases/latest'
      });
    });
});

module.exports = router;
