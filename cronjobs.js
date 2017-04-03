var schedule = require('node-schedule');
var toggle = require('./lib/toggle.js');
var fs = require('fs');
var join = require('path').join;

var callback = function (err) {
  if (err) throw new Error('Cannot move the door.');
};

var morning = schedule.scheduleJob('0 0 9 * * *', function(){
  fs.readFile(join(__dirname, './status.json'), function (err, data) {
    if (err) throw new Error('Cannot get the current status ot the door.');
    if (JSON.parse(data).position === 'down') {
      toggle(callback);
    }
  });
});

var tonight = schedule.scheduleJob('0 45 20 * * *', function(){ 
  fs.readFile(join(__dirname, './status.json'), function (err, data) {
    if (err) throw new Error('Cannot get the current status ot the door.');
    if (JSON.parse(data).position === 'up') {
      toggle(callback);
    }
  });
});
