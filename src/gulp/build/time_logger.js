/* bundleLogger
   ------------
   Provides gulp style logs to the bundle method in browserify.js
*/

var gutil = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

var mainObj = {
  start: function(label) {
    startTime = process.hrtime();
    gutil.log('Running', gutil.colors.green("'" + label + "'") + '...');
  },

  end: function(label) {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    gutil.log('Finished', gutil.colors.green("'" + label + "'"), 'in', gutil.colors.magenta(prettyTime));
  }
};


module.exports = function($) {
  return mainObj;

};