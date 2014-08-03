// Load `*.js` under current directory (except those in the exclude list)
// Each exports object returned will be merged into our exports object
var glob = require('glob');

var globPattern = '**/!(index).js';

function camelize(str) {
  return str.replace(/[-_](\w)/g, function(m, p1) {
    return p1.toUpperCase();
  });
};

glob(globPattern, {
  cwd: __dirname,
  sync: true
}, function(err, files) {
  files.forEach(function(file) {
    console.log("Requiring file: " + file);
    var name = file.replace('.js', '');
    var moduleExports = require('./' + file)($);
    var n = camelize(path.basename(name));
    console.log("Loading gulp helper: " + n);
    //for (var n in moduleExports) {
    if (exports[n]) console.error("ERROR processing file '" + file + "'.  Object '" + n + "' has already been added to exports list"); //@strip
    exports[n] = moduleExports;
  });
});

console.log("Exports: " + Object.keys(exports));