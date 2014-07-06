

module.exports = function($) {
  var path = $.path;
  return function meta() {
    return $.through2.obj(function (file, enc, cb) {
      var fileProps = $.fileProps(file);
      var targetPath = $.util.template($.config.getRaw("meta.output"), fileProps);
      $.util.log("Extracting meta from: " + file.path + " to " + targetPath);

      var numChannels, duration;
      $.shellOutput("soxi",  ["-c",file.path], function(buffer) {
        numChannels = parseInt(buffer.toString());
        $.util.log("File has " + numChannels + " channels");

        $.shellOutput("soxi",  ["-D",file.path], function(buffer) {
          duration = parseFloat(buffer.toString());
          $.util.log("File duration: " + duration);
          writeMeta();
        });
      });

      function writeMeta() {
        var meta = {
          "name": fileProps.folder,
          "numChannels": numChannels,
          "duration": duration,
          "metaVersion": 1,
          "processTime": new Date().getTime()
        };

        var s = $.through();
        s.pipe($.debug({ verbose: true })).pipe($.gulp.dest(process.cwd())).on('data', function() {
          cb();
        })

        var file = new $.util.File();
        file.contents = new Buffer(JSON.stringify(meta, null, 2));
        file.path = targetPath;
        s.write(file);
      }

    });
  };

}