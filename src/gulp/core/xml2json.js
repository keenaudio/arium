var xml2js = require('xml2js');


module.exports = function($) {
  var path = $.path;
  return function xml2json(outputTemplate) {
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
      $.util.log("Parsing XML file: " + file.path + " to JSON");

      var stream = this;
      var parser = new xml2js.Parser();
      parser.parseString(file.contents, function (err, result) {
        //console.log(JSON.stringify(result, null, 2));
        //console.log('Done');
        file.contents = new Buffer(JSON.stringify(result, null, 2));
        //file.path = targetPath;
        stream.push(file);

        cb();
      });
    });
  }
}
