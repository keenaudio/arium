var xml2js = require('xml2js');


module.exports = function($) {
  var path = $.path;
  return function json2xml(options) {
    return $.through2.obj(function(file, enc, cb) {
      // var ext = path.extname(file.path);
      // var folder = path.basename(file.path, ext);
      // var filename = folder + ext;
      // var targetPath = $.util.template(outputTemplate, {
      //   config: $.config,
      //   file: file,
      //   folder: folder,
      //   filename: filename
      // });
      $.util.log("Parsing JSON file: " + file.path + " to XML");

      var obj = JSON.parse(file.contents);
      $.util.log("Object: " + JSON.stringify(obj));
      var builder = new xml2js.Builder(options);
      var xml = builder.buildObject(obj);
      //console.log(JSON.stringify(result, null, 2));
      //console.log('Done');
      file.contents = new Buffer(xml);
      //file.path = targetPath;
      this.push(file);

      cb();
    });
  }
}