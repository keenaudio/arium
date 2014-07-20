'use strict';

module.exports = function($) {
  var path = $.path;

  function ffProbe(file, enc, cb) {

    $.util.log("Running ffprobe on: " + file.path); // + " to " + targetPath);


    var fileProps = $.fileProps(file);
    //var targetPath = $.util.template($.config.getRaw("meta.output"), fileProps);

    var stream = this;
    var numChannels, duration;
    $.shellOutput("ffprobe", [
      "-v", "quiet",
      "-print_format", "json",
      "-show_format",
      "-i", file.path
    ], function(buffer) {

      $.util.log(buffer.toString());
      var obj = JSON.parse(buffer.toString());
      $.util.log("From obj: " + JSON.stringify(obj));
      var format = obj.format;
      var tags = format.tags;

      $.util.log("Artist: " + tags.artist + " title: " + tags.title);
      var nfo = {
        title: tags.title,
        artist: tags.artist
      };

      file.contents = new Buffer(JSON.stringify(nfo));
      $.util.log("Setting contents: " + file.contents.toString());
      stream.push(file);
      cb();

    });

  }

  return function nfo() {
    $.util.log("NFO");

    return $.through2.obj(ffProbe);
  };
};