var path = require('path');

module.exports = function(config) {

  var configDir = path.resolve(__dirname, '..');
  var srcDir = path.resolve(configDir, '..');
  var rootDir = path.resolve(srcDir, '..');
  var tmpDir = path.join(rootDir, '.tmp');

  //   // Disk paths
  function mkpath() {
    var base = rootDir;
    var extra = arguments[0];
    if (arguments.length === 2) {
      base = arguments[0];
      extra = arguments[1];
    }
    return path.join(base, extra);
  }

  config.merge({
    paths: {
      root: rootDir,
      tmp: tmpDir,
      src: srcDir,
      config: configDir,
      packageJSON: mkpath('package.json'),
      revManifest: mkpath('rev-manifest.json'),
      buildInfo: mkpath('build_info.json'),
      configJSON: mkpath(configDir, 'config.json'),
      configJSONdefault: mkpath(configDir, 'config.defaults.json'),
      web: mkpath(srcDir, 'web')
    }
  });
}