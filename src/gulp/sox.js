module.exports = function($) {
  var sox = {
    info: function soxi(args, cb) {
      $.shellOutput("soxi",  args, function(buffer) {
        cb(buffer);
     });
    },
    channels: function(filePath, cb) {
      sox.info(["-c", filePath], function(buffer) {
        var numChannels = parseInt(buffer.toString());
        cb(numChannels);
      });
    },
    duration: function(filePath, cb) {
      sox.info(["-D",filePath], function(buffer) {
        var duration = parseFloat(buffer.toString());
        cb(duration);
      });
    }
  };

  return sox;
}