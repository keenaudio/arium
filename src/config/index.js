//@if LOG
var _f = function(msg) { return "config/index.js: " + msg; };
//@end

var fs = require('fs');
var path = require('path');

module.exports = function(config) {

  var jsPath = path.resolve(__dirname, './d');
  var excludeJS = [ // JS files to exclude, if any
    'index.js'
  ];

  fs.readdirSync(jsPath).forEach(function(file) {
    if (file.match(/.+\.js/g) !== null && excludeJS.indexOf(file) === -1) {
      var name = file.replace('.js', ''); // allow subdirectories with an index.js
      var filePath = jsPath + '/' + name;
      console.log(_f("Loading JS config: " + filePath)); //@strip
      require(filePath)(config);
    }
  });

  var configPath = config.get("paths.configJSON");
  var defaultPath = config.get("paths.configJSONdefault");
  if (!fs.existsSync(configPath)) {
    console.log(_f(configPath + " was not found, loading defaults from: " + defaultPath)); //@strip
    //fs.writeFileSync(configPath, fs.readFileSync(defaultPath)); // copy, create config.json
    
    config.merge(require(defaultPath)); // load default config

  }


  var jsonPath = __dirname;
  var excludeJSON = [ // JSON files to exclude, if any

  ];

  fs.readdirSync(jsonPath).forEach(function(file) {
    if (file.match(/.+\.json$/g) !== null && excludeJSON.indexOf(file) === -1) {
      var filePath = jsonPath + '/' + file;
      console.log(_f("Loading JSON config: " + filePath)); //@strip
      var jsonData = require(filePath);
      config.merge(jsonData);
    }
  });

  return config;
};