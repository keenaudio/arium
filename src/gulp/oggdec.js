module.exports = function($) {
  var path = $.path;
  return function oggdec() {
    return $.through2.obj(function (file, enc, cb) {
      var ext = path.extname(file.path);
      var folder = path.basename(file.path, ext);
      var filename = folder + ext;
      $.util.log("Decoding " + filename);
      var targetPath = $.util.template($.config.getRaw("oggdec.output"), {
        config: $.config,
        file: file,
        folder: folder,
        filename: filename
      });
      $.util.log("Copying to " + targetPath);
      $.exec([
        'sox -S -t ogg "' + file.path + '" "' + targetPath + '"'
      ], {}, cb);
    });
  }
}
