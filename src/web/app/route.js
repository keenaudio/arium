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
var _f = function(msg) { return "app/route.js: " + msg; };
//@end

module.exports = function(config) {

  var app = express.Router();
  var routes = config.get("routes");
  var paths = config.get("paths");
  var clientConfig = {
    routes: routes
  };

  app.post('/post', bodyParser());
  app.post('/post', function(req, res, next) {
    console.log("Post: " + JSON.stringify(req.body, null, 2));
    var response = {};
    var json = req.body;
    if (json.filename && json.contents) {
      try {
        var filePath = path.join(config.get('paths.posted'), json.filename);
        console.log("Writing file " + filePath);
        fs.writeFileSync(filePath, json.contents);
        response.message = "OK";
      } catch (e) {
        response.error = e;
      }
    } else {
      response.error = "Bad format";
    }
    res.json(response);
  });

  //@if DEV
  if (DEV) {
    app.use(express.static(path.join(paths.tmp, 'web/app'), { hidden: true }));
  }
  //@end


  app.use(express.static('web/app'));

  app.use(function(req, res, next) {
    if (req.path === '/') {
      res.render('app/app.jade', {
        clientConfig: clientConfig
      });
    } else {
      console.log("App: no handler for path: " + req.path);
      next();
    }
  });


  return app;
}