if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['assert', 'underscore', 'node.extend'], function(assert, _, merge) {

//@if LOG
var _ls = "Lib.Config";
var _f = function(msg) { return "[" + _ls + "] " + msg; }
//@end

var Config = function() {
 this.config = {};
}

Config.prototype.getRaw = function(key, defaultValue) {
 if (!key) {
  console.warn(_f("Returning entire config object")); //@strip
  return this.config;
 }
 assert(typeof(key) === 'string'); //@strip
 var parts = key.split('.');
 var obj = this.config;
 for (var i = 0; i < parts.length; i++) {
  obj = obj[parts[i]];
  if (obj === undefined) {
   if (defaultValue === undefined) assert(false, "No config found for key: " + key); //@strip
   obj = defaultValue || obj;
  }
 }
 return obj;
}

Config.prototype.get = function(key, defaultValue, templateVars) {

  var obj = this.getRaw(key, defaultValue);

 if (typeof obj === "string" && obj.indexOf('<') >= 0) {
  obj = _.template(obj, merge({
    config: this
  }, templateVars || {}));
 }

 return obj;
}

Config.prototype.set = function(key, value) {
 assert(typeof(key) === 'string'); //@strip
 var parts = key.split('.');
 assert(parts.length > 0); //@strip
 var obj = this.config;
 var lastKey = parts[parts.length-1];
 assert(lastKey); //@strip
 if (obj.hasOwnProperty(lastKey)) console.log(_f("Overwriting property: " + key + " with value: " + value)); //@strip
 for (var i = 0; i < parts.length-1; i++) {
  var keyPart = parts[i];
  var obj2 = obj[keyPart];
  if (!obj2) {
   console.log(_f("Creating blank object for property: " + keyPart)); //@strip
   obj2 = obj[keyPart] = {};
  }
  obj = obj2;
 }
 obj[lastKey] = value;
 return value;
}
Config.prototype.merge = function(obj) {
 if (!obj) return;
 //console.log(_f('merging config obj: ' + JSON.stringify(obj) + "\n into \n" + JSON.stringify(this.config))); //@strip
 this.config = merge(true, this.config, obj);
 //console.log(_f('config is now:' + JSON.stringify(this.config))); //@strip
}

return Config;

});
