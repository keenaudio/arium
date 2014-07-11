var gulp = require('gulp');
var path = require('path');
var glob = require('glob');
var _ = require('underscore');
var fs = require('fs');
var args = require('yargs').argv;// Command line args

// Core helpers
var $ = require('gulp-load-plugins')(); // Load gulp plugins (lazy)
$.merge = require('node.extend');
$.merge($, {
  _: _,
  assert: require('assert'),
  gulp: gulp,
  glob: glob,
  args: args,
  path: path,
  through: require('through'),
  through2: require('through2'),
  fs: fs,
  sequence: require('run-sequence')
});

console.log("$: " + JSON.stringify($));

// Simple helper methods
$.pad = function(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

$.mkdirs = function(dirs) {
  var cmds = [], dir;
  for (var i = 0; i < dirs.length; i++) {
    dir = _.template(dirs[i], { config: $.config });
    cmds.push('mkdir -p "' + dir + '"');
    $.util.log("Creating directory: " + dir);
  }

  return $.shell.task(cmds);
}

// hasChanged callback handler for gulp-changed
// Build if source is newer or if target does not exist
$.needBuild = function(stream, cb, sourceFile, targetPath) {

  fs.stat(targetPath, function (err, targetStat) {
      if (err && err.code === 'ENOENT') {
        $.util.log("Processing NEW source: " + sourceFile.relative);
        stream.push(sourceFile);
      } else if (sourceFile.stat.mtime > targetStat.mtime) {
        $.util.log("Processing NEWER source: " + sourceFile.relative);
        stream.push(sourceFile);
      } else {
        //$.util.log("NO change needed: " + sourceFile.relative);
      }
      cb();
  });

}

// Config
var Config = require('../lib/common/config');
$.config = new Config();
require('../config')($.config);

// Load `*.js` under current directory (except those in the exclude list)
// Each exports object returned will be merged into our exports object

var globPattern = '**/!(index).js';

var helpers = {};

function camelize(str) {
  return str.replace(/[-_](\w)/g, function(m, p1) {
    return p1.toUpperCase();
  });
};

glob(globPattern, { cwd: __dirname, sync: true }, function(err, files) {
  _.each(files, function(file) {
    console.log("Requiring file: " + file);
    var name = file.replace('.js', '');
    var moduleExports = require('./' + file)($);
    var n = camelize(path.basename(name));
   // console.log("Loading gulp helper: " + n);
    //for (var n in moduleExports) {
      if (helpers[n]) console.error("ERROR processing file '" + file + "'.  Object '" + n + "' has already been added to exports list"); //@strip
      helpers[n] = moduleExports;
  });
});

console.log("Gulp helpers: " + Object.keys(helpers));

$.merge($, helpers); // Load gulp helpers

module.exports = $;



