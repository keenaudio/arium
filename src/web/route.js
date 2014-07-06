'use strict';

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
var _f = function(msg) { return "web/route.js: " + msg; };
//@end

module.exports = function(config, api) {
console.log("WEB ROUTE");

  var app = express.Router();
  var routes = config.get('routes');
  var paths = config.get('paths');
  console.log("PATHS: " + JSON.stringify(paths, null, 2));

  var clientConfig = {
    routes: routes
  };

  app.use(function(req, res, next) {
    //console.log(_f("START REQUEST: " + req.url));
    next();
  });

  var bowerPath = path.join(paths.root, 'bower_components');
  console.log("Bower path: " + bowerPath);
  app.use('/bower_components', express.static(bowerPath));
  app.use('/fonts', express.static(path.join(paths.root, 'bower_components/bootstrap/dist/fonts')));


  app.use(config.get('routes.folders'), express.static(config.get('paths.folders')));

  app.use(config.get('routes.folders') + '/:folder', function(req, res, next) {
    var folder = req.params.folder;
    api.wavs(folder, function(err, files) {
      res.render('pages/files.jade', {
        files: files,
        folder: folder
      });
    });
  });

  app.use(config.get('routes.folders'), function(req, res, next) {
    api.folders(function(err, files) {
      res.render('pages/folders.jade', {
        folders: files
      });
    });
  });

  // app.use(config.get('routes.als') + '/:project', function(req, res, next) {

  //   var folder = req.params.project;
  //   var filePath = path.join(config.get("paths.als"), folder, folder) + ".als.json";
  //   var jsonStr = fs.readFileSync(filePath);
  //   var json = JSON.parse(jsonStr);

  //   console.log(_f("ALS JSON: " + jsonStr)); //@strip
  //   api.alsProjects(function(err, files) {
  //     res.render('pages/als.jade', {
  //       projects: files,
  //       jsonStr: jsonStr,
  //       json: json
  //     });
  //   });
  // });


  // app.use(config.get('routes.als'), function(req, res, next) {
  //   api.alsProjects(function(err, files) {
  //     res.render('pages/als.jade', {
  //       projects: files
  //     });
  //   });
  // });
  app.use(config.get('routes.als'), express.static(config.get('paths.als')));
  app.use(config.get('routes.daw'), require(path.join(paths.web, 'daw/route'))(config, api));
  app.use(config.get('routes.app'), require(path.join(paths.web, 'app/route'))(config, api));

  //@if DEV
  if (DEV) {
    app.use(config.get('routes.static'), express.static(path.join(paths.tmp, 'web/static'), { hidden: true }));
  }
  //@end

  app.use(config.get('routes.static'), express.static(path.join(paths.web, 'static')));

  //@if DEV
  if (DEV) {
    app.use(config.get('routes.lib'), express.static(path.join(paths.tmp, 'lib'), { hidden: true }));
  }
  //@end

  app.use(config.get('routes.lib'), express.static(path.join(paths.src, 'lib')));


  app.use('/', express.static(path.join(paths.tmp, 'web')));
  app.use('/', express.static(paths.web));


  // Last handler, 404
  app.use(function(req, res, next) {
    if (req.path === '/') {
      //res.render('pages/index.jade', {});
      res.redirect(config.get('routes.app'));
      return;
    }

    console.log(_f("404 Not found: " + req.path)); //@strip
    res.send(404);
  });


  return app;
}