var cp = require('child_process');

module.exports = function($) {
  var path = $.path;
  return function shellOutput(cmd, args, cb) {
    // spawn program
    var program = cp.spawn(cmd, args);

    // create buffer
    var newBuffer = new Buffer(0);

    // when program receives data add it to buffer
    program.stdout.on("readable", function () {
      var chunk;
      while (chunk = program.stdout.read()) {
        newBuffer = Buffer.concat([
          newBuffer,
          chunk
        ], newBuffer.length + chunk.length);
      }
    });

    // when program finishes call callback
    program.stdout.on("end", function () {
      cb(newBuffer);
    });
  };
}
