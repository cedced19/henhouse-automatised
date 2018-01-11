var schedule = require('node-schedule');
var toggle = require('./lib/toggle.js');
var fs = require('fs');
var suncalc = require('suncalc');
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

var close = function(){
  fs.readFile(join(__dirname, './status.json'), function (err, data) {
    if (err) throw new Error('Cannot get the current status ot the door.');
    if (JSON.parse(data).position === 'up') {
      toggle(callback);
    }
  });
}

var calc = schedule.scheduleJob('0 0 16 * * *', function(){
  var sunset = suncalc.getTimes(new Date(), 48.767102124, 7.2589588165).sunset;
  sunset.setHours(sunset.getHours() + 1);
  sunset.setMinutes(sunset.getMinutes() + 10);
  console.log('The door will be closed at: ' + sunset.getHours() + ':' + ((sunset.getMinutes()<10) ? '0': '') + sunset.getMinutes());
  schedule.scheduleJob(sunset, close);
});

var tonight = schedule.scheduleJob('0 0 23 * * *', close);
