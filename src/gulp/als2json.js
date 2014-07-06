
module.exports = function($) {
  var path = $.path;
  return function als2json(outputTemplate) {
    return $.through2.obj(function (file, enc, cb) {
      // var ext = path.extname(file.path);
      // var folder = path.basename(file.path, ext);
      // var filename = folder + ext;
      // var targetPath = $.util.template(outputTemplate, {
      //   config: $.config,
      //   file: file,
      //   folder: folder,
      //   filename: filename
      // });
    //  $.util.log("Parsing AlS file: " + file.path + " to JSON: " + targetPath);

      $.gulp.src(file.path)
        .pipe($.gunzip())
        .pipe($.debug({ verbose: true }))
        .pipe($.xml2json())
        .pipe($.tRename(outputTemplate, { extension: '.als' }))
        .pipe($.debug({ verbose: true }))
        .pipe($.gulp.dest('./'))
        .on('end', function() {
          $.util.log('als2json complete');
          cb();
        });
    });
  }
}
