module.exports = function(req, res, next) {
  var users = require('../users.json');
  if (users.length == 0) {
    next();
  } else if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    next();
  }
};
