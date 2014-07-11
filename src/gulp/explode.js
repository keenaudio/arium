module.exports = function($) {
  var path = $.path;
  var fs = $.fs;


  return function explode() {
    return $.through2.obj(function (file, enc, next) {

      var fileProps = $.fileProps(file);
      var metaPath = $.util.template($.config.getRaw("meta.output"), fileProps);

      var metaStr = fs.readFileSync(metaPath);
      $.util.log("meta: " + metaStr);
      var meta = JSON.parse(metaStr);

      var numChannels = meta["numChannels"];
      $.util.log("Exploding " + file.path + " with " + numChannels + " channels");


      function createTargetFolder(cb) {
        var targetFile = $.util.template($.config.getRaw("explode.output"), $.merge(fileProps, { tracknum: 1 }));
        var targetDir = path.resolve(path.dirname(targetFile),'..');
        var folder = path.dirname(path.resolve(targetFile)); //fileProps.folder;
        $.util.log("Creating folder " + folder); // + " in targetDir " + targetDir);

        $.exec([
          'mkdir -p "' + folder + '"'
        ], {
          //cwd: targetDir
        }, cb);
      };

      var curChannel = 0;

      function createWav(tracknum, cb) {;

        var targetFile = $.util.template($.config.getRaw("explode.output"), $.merge(fileProps, { tracknum: tracknum }));

        $.exec([
          'sox -V0 -S "' + file.path + '" "' + targetFile + '" remix ' + tracknum
        ], {}, cb);

      };


      function nextWav() {
        curChannel++;
        if (curChannel > numChannels) {
         $.util.log("ALL DONE");
          next();
        } else {
          createWav(curChannel, nextWav);
        }
      }

      createTargetFolder(nextWav);

    });

  };
}