var assert = require('assert');
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var handleError = require('./handle_error')(false);

//var externs = ['jquery'];

var mainFunc = function(options) {
  assert(options && options.src && options.dest, "Options src & dest are required"); //@strip
  var fileName = options.fileName || 'bundle.js';

  var watch = options.watch || false;
  var production = options.prod || false;
  var externals = options.externals || [];
  var standalone = options.standalone || '';

  var bundler, rebundle;
  bundler = browserify(options.src, {
    basedir: process.cwd(), //__dirname, 
    debug: !production,
    extensions: ['.coffee'],
    standalone: standalone,
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if (watch) {
    bundler = watchify(bundler)
  }

  externals.forEach(function(lib) {
    console.log("External: " + lib);
    bundler.external(lib);
  });



  if (options.transform) {
    bundler.transform(options.transform);
  }

  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', handleError);
    stream = stream.pipe(source(fileName));


    return stream.pipe(gulp.dest(options.dest));
  };

  bundler.on('update', rebundle);
  return rebundle();
};

module.exports = function($) {
  return mainFunc;
}