var express = require('express');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var _ = require('underscore');
var bodyParser = require('body-parser')

//@if DEV
var DEV = (process.env.NODE_ENV === "development");
//@end

//@if LOG
var _f = function(msg) { return "daw/route.js: " + msg; };
//@end

module.exports = function(config) {

  var app = express.Router();
  var routes = config.get('routes');
  var paths = config.get('paths');

  var clientConfig = {
    routes: routes,
    paths: paths
  };

  //@if DEV
  if (DEV) {
    app.use(express.static(path.join(paths.tmp, 'web/daw'), { hidden: true }));
  }
  //@end


  app.use(express.static(path.join(paths.web, 'daw')));


  return app;
}