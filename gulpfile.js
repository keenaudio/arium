'use strict';

var _ = require('underscore');
var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

var $ = require('./src/gulp'); // Gulp helper object

// Tasks
gulp.task('build-lib', function() {
  console.log('browserify lib..' + $);
  return $.browserify({
    src: './src/lib',
    dest: './dist',
    fileName: 'lib.js',
    externals: ['jquery', 'assert'],
    standalone: 'Lib'
  });
});

gulp.task('watch-lib', function() {
  console.log('watchify lib' + $);
  return $.browserify({
    watch: true,
    src: './src/lib',
    dest: './.tmp/web',
    fileName: 'lib.js',
    //   externals: ['jquery'],
    standalone: 'Lib'
  });
});

gulp.task('build-daw', function() {
  console.log('browserify daw..' + $);
  return $.browserify({
    src: './src/web/daw',
    dest: './dist',
    fileName: 'daw.js',
    standalone: 'Daw'
  });
});


gulp.task('watch-daw', function() {
  console.log('watchify daw..' + $);
  return $.browserify({
    watch: true,
    src: './src/web/daw',
    dest: './.tmp/web',
    fileName: 'daw.js',
    standalone: 'Daw'
  });
});


gulp.task('build-app', function() {
  console.log('browserify app..' + $);
  return $.browserify({
    src: './src/web/app',
    dest: './dist',
    fileName: 'app.js',
    standalone: 'App'
  });
});


gulp.task('watch-app', function() {
  console.log('watchify daw..' + $);
  return $.browserify({
    watch: true,
    src: './src/web/app',
    dest: './.tmp/web',
    fileName: 'app.js',
    standalone: 'App'
  });
});


gulp.task('watch', [], function(cb) {
  // return;

  // gulp.watch('src/{lib,server,web}/**/*.coffee', {
  //   mode: 'poll'
  // }, ['coffee']);
  // gulp.watch("src/web/app/**/*.jade", {
  //   mode: 'poll'
  // }, ["app-templates"]); // recompile jade templates to JS on file save
  // gulp.watch("src/web/daw/**/*.jade", {
  //   mode: 'poll'
  // }, ["daw-templates"]);
  gulp.watch('src/web/**/*.less', {
    // mode: 'poll'
  }, ['less']);

  var lr = livereload();
  gulp.watch([
    ".tmp/{web,lib,static}/**/*"
  ], {
    // glob: , 
    // emitOnGlob: false, 
    // emit: "all",
    // mode: 'poll'
  }, function(event) {
    $.util.log('WATCH CHANGE: ' + event.type + ' ' + event.path);
    lr.changed(event.path);
  });

  //.pipe(lr);
});


gulp.task('clean', function() {
  return gulp.src([
    ".tmp",
    "dist",
  ], {
    read: false
  }).pipe($.clean());
});

gulp.task('mkdirs', $.mkdirs($.config.get("create_dirs")));


gulp.task('prepare', function(cb) {
  $.sequence('clean', 'mkdirs', cb);
});

gulp.task('default', ['prepare'], function(cb) {
  //$.util.log("mogg2wav, running with config: " + JSON.stringify($.config, null, 2));
  require('./src/gulpfile');

  $.sequence(
    'library',
    cb);
});

gulp.task('copy-web-tmp', function() {
  var jsFilter = $.filter(['**/*.js', '!build.js']);

  return gulp.src([
      'src/*lib/**/*.{js,css}',
      'src/web/**/*.{js,css}'
    ])
    .pipe(jsFilter)
    .pipe($.ngmin())
    .pipe(jsFilter.restore())
    .pipe(gulp.dest('.tmp/web'));
});

gulp.task('copy-web-dist', function() {
  return gulp.src([
      'static*/**/*'
    ], {
      cwd: '.tmp/web'
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('require-js', function(cb) {
  $.exec(['node_modules/requirejs/bin/r.js -o .tmp/web/build.js'], {}, cb);
});


gulp.task('build-html-tmp', function() {

  var htmlFilter = $.filter("**/*.html");
  return gulp.src("src/web/**/index.jade")
    .pipe($.jade({
      pretty: true,
      locals: {
        config: $.config,
        clientConfig: {
          buildTime: new Date().getTime()
        },
        CDN: true
      }
    }))
    .pipe(htmlFilter)
    .pipe($.replace(/<!--/g, "\n<!--"))
    .pipe(gulp.dest('.tmp/web'))
    .pipe(htmlFilter.restore());

});

gulp.task('build-html-dist', function() {

  return gulp.src(".tmp/web/index.html")
    .pipe($.useref.assets({
      searchPath: [
        '.tmp/web',
        './'
        // './../../'
        // './',
        // './src/web'
      ]
    }))
    //.pipe($.debug({verbose: true}))
    //.pipe($.if('*.css'))
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.rename({
      dirname: './'
    })))
    .pipe(gulp.dest('dist'));


});

gulp.task('build-web-tmp', function() {
  var coffeeFilter = $.filter("**/*.coffee");
  var jsFilter = $.filter("**/*.js");
  var lessFilter = $.filter("**/*.less");
  var cssFilter = $.filter("**/*.css");
  var jadeFilter = $.filter("**/*.jade")

  return gulp.src([
      'src/web/**/*.{coffee,less}',
      'src/*lib/**/*.{coffee,less}'
      //'!src/config/*.!{default}.json' // skip user config json files
    ])
    .pipe(coffeeFilter)
    .pipe($.jsmacro({
      regex: {
        strip: /(.*)#[\@|#]strip.*/ig
      }
    }))
    .pipe($.coffee({
      bare: true
    }).on('error', $.util.log))
    .pipe(coffeeFilter.restore())
    .pipe(lessFilter)
    .pipe($.less({
      paths: path.join(__dirname, 'src/web/app/styles'),
      sourceMapBasepath: path.join(__dirname, 'web')
    }).on('error', $.util.log))
    .pipe(lessFilter.restore())
    .pipe(jsFilter)
    .pipe($.ngmin())
    .pipe(jsFilter.restore())

  // .pipe(jadeFilter)
  // .pipe($.debug())
  // .pipe(jadeFilter.restore())
  .pipe(gulp.dest('.tmp/web'));
});

gulp.task('build', ['clean'], function(cb) {
  $.sequence(
    'copy-web-tmp',
    'app-templates',
    'daw-templates',
    'build-web-tmp',
    'build-html-tmp',
    'require-js',
    'build-html-dist',
    'copy-web-dist',
    cb);
});

gulp.task('server', ['clean'], function(cb) {
  // start LR server
  livereload();
  console.log("$: " + JSON.stringify($));
  $.sequence('less', 'watch-app', function() {
    $.util.log("Now starting server and watch");
    $.gulp.start('dev-server', 'watch', function() {
      $.util.log("Somehow it is all over?");
    })

  });
});

gulp.task('server:dist', ['build'], function(cb) {
  $.sequence('dist-server');
})

var serverArgs = function(dist) {
  // Build command line args for express server
  var args = [];
  args.push("--port=8008");
  if ($.args['server-url']) {
    args.push("--server-url=" + $.args['server-url']);
  }

  if (dist) {
    //args.push("--config-file=../src/config.json");
  }
  return args;
};

gulp.task("app-templates", function() {

  var jadeVars = {
    "NG": true,
    config: $.config,
    baseUrl: $.config.get('routes.app')
  };

  return gulp.src("{views,components}/**/*.jade", {
      cwd: "src/web/app"
    })
    // .pipe(jadeFilter)
    // .pipe($.jsmacro($.options.jsmacro.client)) // unlike html, jade will be processed with jsmacro
    // .pipe($.debug({ verbose: true }))

  .pipe($.jade({
    pretty: true,
    locals: jadeVars
  }))
  // .pipe($.debug({ verbose: true }))
  //.pipe(jadeFilter.restore())
  .pipe($.html2js({
    moduleName: "app-templates",
    // declareModule: false,
    rename: function(filename) {
      return filename.replace('.html', '.jade');
    }
    //  stripPrefix: config.cwd
  }))
  //  .pipe($.concatUtil('templates.js'))
  .pipe($.rename({
    dirname: "web/app",
    basename: "templates"
  }))
  // .pipe($.debug({ verbose: true }))

  // .pipe($.concat(config.module + '.js'))
  .pipe(gulp.dest(".tmp"))
    .pipe($.size({
      showFiles: true
    }));

});

gulp.task("daw-templates", function() {

  var jadeVars = {
    "NG": true,
    config: $.config,
    baseUrl: $.config.get('routes.app')
  };

  return gulp.src("{views,components}/**/*.jade", {
      cwd: "src/web/daw"
    })
    // .pipe(jadeFilter)
    // .pipe($.jsmacro($.options.jsmacro.client)) // unlike html, jade will be processed with jsmacro
    //.pipe($.debug({ verbose: true }))

  .pipe($.jade({
    pretty: true,
    locals: jadeVars
  }))
  // .pipe($.debug({ verbose: true }))
  //.pipe(jadeFilter.restore())
  .pipe($.html2js({
    moduleName: "daw-templates",
    // declareModule: false,
    rename: function(filename) {
      return filename.replace('.html', '.jade');
    }
    //  stripPrefix: config.cwd
  }))
  //  .pipe($.concatUtil('templates.js'))
  .pipe($.rename({
    dirname: "web/daw",
    basename: "templates"
  }))
  // .pipe($.debug({ verbose: true }))

  // .pipe($.concat(config.module + '.js'))
  .pipe(gulp.dest(".tmp"))
    .pipe($.size({
      showFiles: true
    }));

});


gulp.task('coffee', function() {

  var srcRoot = $.config.get('paths.web');
  $.util.log("Starting coffee, source root: " + srcRoot);
  return gulp.src('src/{lib,server,web}/**/*.coffee')
    .pipe($.changed('.tmp', {
      extension: ".js",
      hasChanged: $.needBuild
    }))
    .pipe($.sourcemaps.init())
    .pipe($.coffee({
      bare: true
    }).on('error', $.util.log))
    .pipe($.sourcemaps.write({
      sourceRoot: "./"
    }))
    .pipe(gulp.dest('.tmp'));

});

gulp.task('less', function() {

  return gulp.src('src/web/**/*.less')
    .pipe($.changed('.tmp', {
      extension: ".css",
      hasChanged: $.needBuild
    }))
    .pipe($.debug({
      verbose: true
    }))
    .pipe($.sourcemaps.init())
    .pipe($.less({
      paths: path.join(__dirname, 'src/web/app/styles'),
      sourceMapBasepath: path.join(__dirname, 'web')
    }).on('error', $.util.log))
    .pipe($.sourcemaps.write({
      sourceRoot: '/'
    }))
    .pipe(gulp.dest('.tmp/web'));

});


var lrServer;

function livereload() {
  if (!lrServer) {
    var lrPort = $.config.get("ports.livereload");
    $.util.log("Starting livereload server on port: " + lrPort);
    lrServer = $.livereload(lrPort);
  }
  return lrServer;
}




gulp.task('dev-server', function(cb) {
  var lr = livereload();
  var args = serverArgs(false);
  var file = $.path.resolve('./src/server.js');

  var env = $.merge(process.env, {
    NODE_ENV: 'development',
    //  NODE_DEBUG: "livereload,express:*",
    DEBUG: "tinylr:*,send,xbmc:*"
  });

  $.util.log("Server env: " + JSON.stringify(env, null, 2));

  var server = $.server(file, {
    args: args,
    env: env
  });

  server.on('server.started', function() {
    $.util.log("Received SERVER STARTED event.");
  });

  server.start();

  $.watch({
    glob: ['.tmp/_livereload'],
    emitOnGlob: false
  }, function(stream) {
    $.util.log("Sending LIVERELOAD event to all clients");
    // setTimeout(function() {
    //for (var i = 0; i < lrServers.length; i++) {
    lr.changed("/");
    //}
    //}, 2000);
  });

  $.watch({
    glob: [
      file,
      'src/config/*.json',
      'src/server/**/*'
    ],
    timeout: 1000,
    emitOnGlob: false,
    //   passThrough: false
  }, function(stream) {
    $.util.log("Server files changed, server will restart");
    //return stream;
  })
    .pipe(server);

});


gulp.task('dist-server', function(cb) {
  var args = serverArgs(true);
  var file = options.serverFile.dist;

  $.util.log("Starting dist server: " + file + " : " + JSON.stringify(args));

  gulp.src(file)
    .pipe($.server(file, {
      args: args
    }));
});