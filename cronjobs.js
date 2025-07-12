var schedule = require('node-schedule');
var toggle = require('./lib/toggle.js');
var fs = require('fs');
var suncalc = require('suncalc');
var path = require('path');

require('dotenv').config({path: path.resolve(__dirname, './.env')});

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

function callback (err) {
  if (err) throw new Error('Cannot move the door.');
};

var morning = schedule.scheduleJob('0 0 9 * * *', function(){
  fs.readFile(path.join(__dirname, './status.json'), function (err, data) {
    if (err) throw new Error('Cannot get the current status ot the door.');
    if (JSON.parse(data).position === 'down') {
      toggle(callback);
    }
  });
});

var close = function(){
  fs.readFile(path.join(__dirname, './status.json'), function (err, data) {
    if (err) throw new Error('Cannot get the current status ot the door.');
    if (JSON.parse(data).position === 'up') {
      toggle(callback);
    }
  });
}

var calc = schedule.scheduleJob('0 0 16 * * *', function(){
  var sunset = addMinutes(suncalc.getTimes(new Date(), process.env.COORDS_LAT, process.env.COORDS_LNG).sunset, process.env.MARGIN_MIN);
  schedule.scheduleJob(sunset, close);
});

var tonight = schedule.scheduleJob('0 0 20 * * *', close);

var sunset = addMinutes(suncalc.getTimes(new Date(), process.env.COORDS_LAT, process.env.COORDS_LNG).sunset, process.env.MARGIN_MIN);
schedule.scheduleJob(sunset, close);