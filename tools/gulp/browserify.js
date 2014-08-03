
var assert = require('assert');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


module.exports = function(options) {
  assert(options && options.src && options.dest, "Options src & dest are required"); //@strip

  var watch = options.watch || false;
  var production = options.prod || false;

  var bundler, rebundle;
  bundler = browserify(options.src, {
    basedir: __dirname, 
    debug: !production, 
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler) 
  }
 
  if (options.transform) {
    bundler.transform(options.transform);
  }
 
  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', handleError('Browserify'));
    stream = stream.pipe(source('bundle.js'));
    return stream.pipe(gulp.dest(options.dest));
  };
 
  bundler.on('update', rebundle);
  return rebundle();


}