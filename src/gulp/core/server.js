var cp = require('child_process');

module.exports = function($) {
  return function server(fileName, opt){
    $.util.log("Server fleName: " + fileName + " options: " + JSON.stringify(opt, null, 2)); //@strip

    var options = $.merge({
      cwd: process.cwd(),
      nodeArgs: [],
      args: [],
      env: process.env || {},
      cmd: process.argv[0]
    }, opt || {});

    var stream, child, timeout, running = false, ignoreChanges = false;

    function processFile(file){
      $.util.log("dev-server processFile: " + file.path + " running: " + running + " ignoreChanges: " + ignoreChanges);
      if (ignoreChanges) return;
      startServer();
      if (!timeout) {
        $.util.log("Setting timeout to start Server");
        timeout = setTimeout(startServer, 250);
      } else {
        $.util.log("There is already a timeout pending");
      }
    }

    function startServer(){
      $.util.log("timeout END. Starting server");
      ignoreChanges = true;
      timeout = false;
      stream.emit('server.start', fileName, options.nodeArgs, options.args, options.env, options.cmd);
    }

    stream = $.through(processFile);
    stream.start = startServer;

    stream.on('server.start', function(filename, nodeArgs, args, env, cmd) {
      $.util.log("Received server.start event.  running: " + running + " env: " + JSON.stringify(env, null, 2));
      if (running) {
        stream.emit('server.stop');
        return;
      }
      var spawnArgs = nodeArgs.concat([filename], args);
      $.util.log("Launching server: " + cmd + " , " + JSON.stringify(spawnArgs));
      child = cp.spawn(cmd, spawnArgs, {
        env: env
      });
      running = true;
      child.on('exit', function(code, signal) {
        running = false;
        if (signal !== null) {
          $.util.log('application exited with signal ', signal);
        } else {
          $.util.log('application exited with code ', code);
        }
        if (signal === 'SIGKILL') {
          $.util.log("Received SIGKILL from child process. Restarting server");
          stream.emit('server.start', filename, nodeArgs, args, env, cmd);
        }
      });
      child.stdout.on('data', function(buffer) {
        $.util.log('[dev-server STDOUT] > ' + String(buffer));
      });
      child.stderr.on('data', function(buffer) {
        $.util.log('[dev-server STDERR] > ' + String(buffer));
      });
      stream.emit('server.started');
    });

    stream.on('server.stop', function() {
      $.util.log("Received 'server.stop' event.  running: " + running);

      if (running) {
        $.util.log("Server is running.  Stopping it now");
        child.kill('SIGKILL');
        running = false;
      }
    });
    stream.on('server.started', function() {
      $.util.log("Server has started, now watching files for changes");
      ignoreChanges = false;
    });

   return stream;
  };
}