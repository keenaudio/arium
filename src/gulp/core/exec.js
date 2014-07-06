module.exports = function($) {
  return function exec(commands, options, cb) {
    var task = $.shell.task(commands, options);
    var stream = task();
    stream.once('end', function() {
      $.util.log("shell commands done");
      cb();
    }).on('error', function(err) {
      $.util.log("ERROR: " + err)
    }).on('data', function(data) {
      $.util.log("got data: " + data);
    });
    return stream;
  }
}