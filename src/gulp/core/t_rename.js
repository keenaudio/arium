
module.exports = function($) {
  var path = $.path;
  return function tRename(template, options) {
    var o = options || {};
    return $.through2.obj(function (file, enc, cb) {
      var ext = o.extension || path.extname(file.path);
      var folder = path.basename(file.path, ext); 
      var filename = folder + ext;
            
      var targetPath = $.util.template(template, $.merge({
        config: $.config,
        file: file,
        folder: folder,
        filename: filename
      }, o.locals || {}));

      $.util.log("Renaming file: " + file.path + " to: " + targetPath + " ext: " + ext + " folder: " + folder);
      file.path = targetPath;
      file.base = process.cwd();
      this.push(file);
      cb();
    });
  }
}
