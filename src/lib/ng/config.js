var Config = require("config");

//@if LOG
var _ls = "ng.config";
//var console = Logger.get(_ls);
var _f = function(msg) {
    return "[" + _ls + "] " + msg;
  }
  //@end

var mod = angular.module('config', [ // module dependencies
]);

var instance = new Config();

mod.config(function(CONFIG_JSON) {
  instance.merge(CONFIG_JSON);
});

mod.run(function() {
  console.log(_f('config module run')); //@strip

});

mod.value('config', instance);

mod.init = function(configData) {
  console.log(_f('config module LOAD')); //@strip
  instance.merge(configData);

  var initInjector = angular.injector(['ng']);
  var $q = initInjector.get('$q');
  var deferred = $q.defer();

  if (instance.get("loadJSON", false) === true) {
    var $http = initInjector.get('$http');
    var req = $http.get('/config.json').then(function(response) {
      mod.constant('CONFIG_JSON', response.data);
    })["catch"](function() {
      mod.constant('CONFIG_JSON', {});
    })["finally"](function() {
      deferred.resolve(instance);
    });
  } else {
    mod.constant('CONFIG_JSON', {});
    deferred.resolve(instance);
  }

  var promise = deferred.promise;

  //@if COOKIE_PREFS
  // promise = promise.then(function(value) {
  //   var cookieInjector = angular.injector(['ngCookies']);
  //   var $cookieStore = cookieInjector.get('$cookieStore');

  //   var cookieConfig = $cookieStore.get('config');
  //   if (cookieConfig) {
  //     console.log(_f("Merging in config from cookie: " + JSON.stringify(cookieConfig, null, 2))); //@strip
  //     instance.merge(cookieConfig);
  //   }
  //   return value;
  // });
  //@end

  return promise;

}