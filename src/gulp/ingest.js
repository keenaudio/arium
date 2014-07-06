module.exports = function($) {
  var path = $.path;
  return function ingest(outputTemplate, options) {
    var o = options || {};
    return $.through2.obj(function (file, enc, cb) {
      var ext = path.extname(file.path);
      var folder = path.basename(file.path, ext);
      var filename = folder + ext;
      var targetPath = $.util.template(outputTemplate, {
        config: $.config,
        file: file,
        folder: folder,
        filename: filename
      });
      $.util.log("Ingesting: " + file.path + " to " + targetPath);
      var srcDir = path.dirname(file.path);
      var targetDir = path.dirname(targetPath);


      $.gulp.src(o.folder ? srcDir + '/**/*' : file.path)
        .pipe(o.folder ? $.through() : $.rename(path.basename(targetPath)))
        .pipe($.gulp.dest(targetDir))
        .on('end', function() {
          $.util.log("Ingestion complete");
          cb();
        })

      // $.exec([
      //     'mkdir -p "' + path.dirname(targetPath) + '"',
      //     'cp "' + file.path + '" "' + targetPath + '"'
      // ], {}, cb);
    });
  }; 
}