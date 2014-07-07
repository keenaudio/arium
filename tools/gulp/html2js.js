var util = require("util");
var gutil = require("gulp-util");
var through = require("through");
var File = gutil.File;

var HEADER = "define(['angular'], function(angular) {\n" +
  "var module = angular.module(\'%s\', []);\n" +
  "module.run([\'$templateCache\', function($templateCache) {\n";
   //\'%s\',\n    \'%s\');\n"

var TEMPLATE = "  $templateCache.put(\'%s\', \'%s\');\n";

var FOOTER = "\n  }]);\n" +
  "});\n";

/**
 * Converts HTML files into Javascript files which contain an AngularJS module which automatically pre-loads the HTML
 * file into the [$templateCache](http://docs.angularjs.org/api/ng.$templateCache). This way AngularJS doens't need to
 * request the actual HTML file anymore.
 * @param [options] - The plugin options
 * @param [options.moduleName] - The name of the module which will be generated. When omitted the fileUrl will be used.
 * @param [options.stripPrefix] - The prefix which should be stripped from the file path
 * @param [options.prefix] - The prefix which should be added to the start of the url
 * @returns {stream}
 */
module.exports = function(options){
  "use strict";

  var buffer = [];  

  function onFile(file){

    var contents = String(file.contents).trim();
    var escapedContent = escapeContent(contents);
    var fileUrl = getFileUrl(file);
    buffer.push(util.format(TEMPLATE, fileUrl, escapedContent));
  }

  function onEnd() {
    var joinedContents = buffer.join("");

    //var joinedPath = path.join(firstFile.base, fileName);
    var fileName = options.moduleName + ".js";
    gutil.log("ngHtml2js > " + fileName);

    var header = util.format(HEADER, options.moduleName);
    var footer = FOOTER;

    var joinedFile = new File({
      cwd: options.cwd,
      base: options.cwd,
      path: fileName,
      contents: new Buffer(header + joinedContents + footer)
    });

    this.emit('data', joinedFile);
    this.emit('end');
  }

  /**
   * Escapes the content of an string so it can be used in a Javascript string declaration
   * @param {string} content
   * @returns {string}
   */
  function escapeContent(content){
    return content.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, "\\n' +\n    '");
  }

    /**
   * Generates the url of a file.
   * @param file - The file for which a url should be generated
   * @param [options] - The plugin options
   * @param [options.stripPrefix] - The prefix which should be stripped from the file path
   * @param [options.prefix] - The prefix which should be added to the start of the url
   * @param [options.rename] - A function that takes in the generated url and returns the desired manipulation.
   * @returns {string}
   */
  function getFileUrl(file){
    // Start with the relative file path
    var url = file.relative;

    // Replace '\' with '/' (Windows)
    url = url.replace(/\\/g, "/");

    // Remove the stripPrefix
    if(options && options.stripPrefix && url.indexOf(options.stripPrefix) === 0){
      url = url.replace(options.stripPrefix, "");
    }
    // Add the prefix
    if(options && options.prefix){
      url = options.prefix + url;
    }

    // Rename the url
    if(options && options.rename){
      url = options.rename(url);
    }

    return url;
  }

  return through(onFile, onEnd);
};
