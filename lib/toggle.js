var fs = require('fs');
var exec = require('child_process').exec;
var join = require('path').join;
var toggling = false;

module.exports = function (cb) {
  if (toggling) return cb(true);
  toggling = true;
  fs.readFile(join(__dirname, '../status.json'), function (err, data) {
    if (err) return cb(err);

    var status;
    if (JSON.parse(data).position === 'up') {
      status = 'down';
    } else {
      status = 'up';
    }
    exec('python ' + join(__dirname, '../') + status + '.py', function (err) {
      if (err) {
        toggling = false;
        return cb(err);
      }
      fs.writeFile(join(__dirname, '../status.json'), JSON.stringify({position: status}), function (err) {
        toggling = false;
        if (err) {
          return cb(err);
        }
        cb(null, status);
      });
    });
  });
}
