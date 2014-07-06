var xml2js = require('xml2js');


module.exports = function($) {
  var path = $.path;
  return function ableton() {
    return $.through2.obj(function (file, enc, cb) {
      var ext = path.extname(file.path);
      var folder = path.basename(file.path, ext);
      var filename = folder + ext;
      var targetPath = $.util.template($.config.getRaw("ableton.output"), {
        config: $.config,
        file: file,
        folder: folder,
        filename: filename
      });
      $.util.log("Parsing Ableton file: " + file.path + " to " + targetPath);

      var parser = new xml2js.Parser();
      parser.parseString(file.contents, function (err, result) {
        console.log(JSON.stringify(result, null, 2));
        console.log('Done');
        file.contents = new Buffer(result);
        cb();
      });
    });
  }
}
