/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify = require('browserify');
var watchify = require('watchify');
//var bundleLogger = require('../util/bundleLogger');
var gulp = require('gulp');
//var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');

module.exports = function($) {

  return false;

  function process(method, options) {}

  return {
    bundle: function(options) {
      var bundler = browserify(options);
      return bundler.bundle();

    },
    watch: function(options) {
      var bundler = watchify(options);
      var bundle = function() {

        bundler.bundle();

        // Rebundle with watchify on changes.
      }
      bundler.on('update', bundle);

    }

  };

  function f(options) {
    var bundleMethod = global.isWatching ? watchify : browserify;

    var bundler = bundleMethod({
      // Specify the entry point of your app
      entries: ['./src/javascript/app.coffee'],
      // Add file extentions to make optional in your requires
      extensions: ['.coffee', '.hbs'],
      // Enable source maps!
      debug: true
    });

    var bundle = function() {
      // Log when bundling starts
      bundleLogger.start();

      return bundler
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source('app.js'))
        // Specify the output destination
        .pipe(gulp.dest('./build/'))
        // Log when bundling completes!
        .on('end', bundleLogger.end);
    };

    if (global.isWatching) {
      // Rebundle with watchify on changes.
      bundler.on('update', bundle);
    }

    return bundle();


  };

};