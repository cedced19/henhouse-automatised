module.exports = function(req, res, next) {
  var config = require('../configuration.json');
  if (config.users.length == 0) {
    next();
  } else if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    next();
  }
};
