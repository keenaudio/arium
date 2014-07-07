'use strict';

var MacroEngine = require('../lib/jsmacro');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through');

module.exports = function(options) {

  if (!options || typeof options !== 'object') throw new PluginError('jsmacro',  'Need options for jsmacro');

  var macro = new MacroEngine(options);
  if (options.define) {
    for (var o in options.define) {
      gutil.log("#define " + o + "=" + options.define[o]);
      macro.handle_define(o, options.define[o]);
    }
  }

  return through(function(file) {
    var post = macro.parse(file.contents.toString());
    if (post.length < 1) {
      throw new PluginError('jsmacro',  'File was empty: ' + file.path);
    } else {
      gutil.log("JSMacro: " + file.path);
      file.contents = new Buffer(post);
      this.push(file);
    }
  });

}
