
module.exports = function($) {
  var path = $.path;
  return function tPath(templateString, fileProps) {
    var targetPath = $.util.template(templateString, fileProps);
    return targetPath;
  }
}
