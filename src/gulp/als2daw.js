
var Als = require('../lib/formats/als');
var Daw = require('../lib/formats/daw');

module.exports = function($) {
  var path = $.path;
  return function als2daw(outputTemplate) {
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
      $.util.log("als2daw file: " + file.path);


      $.gulp.src(file.path)
        .pipe($.through(function(file) {
          $.util.log("Loading Ableton project JSON")
          var alsProject = Als.fromJSON(JSON.parse(file.contents));
          var liveSet = alsProject.liveSet;
          

        }))
      //  .pipe($.gunzip())
      //  .pipe($.debug({ verbose: true }))
      //  .pipe($.xml2json())
        .pipe($.tRename(outputTemplate, { extension: '.als.json' }))
        .pipe($.debug({ verbose: true }))
       // .pipe($.gulp.dest($.config.get('paths.library')))
        .on('end', function() {
          $.util.log('als2daw complete');
          cb();
        });
    });
  }
}
