'use strict';

var _ = require('underscore');
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var $ = require('./gulp'); // Gulp helper object
var api = require('./server/api')($.config);
var Project = require('./lib/formats/project');

$.createProjectFile = function(options) {
  $.assert(options, "Options are required");
  var outPath = path.resolve(path.join(options.folder, "project.json"));
  var folder = path.basename(options.folder);

  var files = $.glob.sync("**/*.wav", { 
      cwd: path.dirname(outPath)
    });

  $.util.log("files: ", JSON.stringify(files, null, 2));

  var tracks = files.map(function(file) {
    return {
      name: path.basename(file, path.extname(file))
    };
  });


  var samples = files.map(function(file) {
    return {
      fileName: file
    };
  });

    
  var project = new Project(folder, "files")
  tracks.forEach(function(track) {
    project.addTrack(new Project.Track(track.name, "file"))
  });

  var set = new Project.Set(folder, "files")
  samples.forEach(function(sample, index) {
    set.addSample(sample, index);
  });

  project.addSet(set);


  //var project = Project.fromFiles(folder, wavs);

  $.util.log("Project: ", project);

  fs.writeFileSync(outPath, JSON.stringify(project, null, 2));
};


gulp.task('library', function(cb) {
  $.sequence(
    'ingest',
    'als2json',
 //   'als2daw',
    'oggdec',
     'meta',
    'explode',
    'create-projects',
    'index',
    cb);

});

gulp.task('create-projects', function(cb) {
  api.folders(function(error, folders) {
    folders.forEach(function(folder, i) {
      var outPath = path.join($.config.get('paths.library'), folder);
      $.createProjectFile({
        folder: outPath
      });
    });
    cb();
  });
});

// Index
gulp.task('index', function(cb) {
  api.folders(function(error, folders) {
    var content = JSON.stringify({
      folders: folders
    }, null, 2);
    var outPath = path.join($.config.get('paths.library'), 'index.json');
    fs.writeFile(outPath, content, function() {

      folders.forEach(function(folder, i) {
        $.util.log("Index: " + folder);
        outPath = path.join($.config.get('paths.library'), folder);
        var files = $.glob.sync("*.json", { cwd: outPath });
        files = files.filter(function(file) {
          return file !== 'index.json';
        });
        $.util.log("Files: ", files);
        outPath = path.join(outPath, 'index.json');
        content = JSON.stringify({
          files: files
        }, null, 2);
        fs.writeFileSync(outPath, content);
      });

      cb();

    });
  });
});

// Ingest
gulp.task('ingest', function() {
  var moggFilter = $.filter("**/*.mogg");
  var alsFilter = $.filter("**/*.als");
  return gulp.src($.config.get("ingest.input"), { buffer: false })
    .pipe(moggFilter)
    .pipe($.args.force ? $.through() : $.hasChanged($.config.getRaw("ingest.output.mogg"))) // only process new/changed files
    .pipe($.ingest($.config.getRaw("ingest.output.mogg")))
    .pipe(moggFilter.restore())
    .pipe(alsFilter)
    .pipe($.args.force ? $.through() : $.hasChanged($.config.getRaw("ingest.output.als"))) // only process new/changed files
    .pipe($.ingest($.config.getRaw("ingest.output.als"), { folder: true }))
    .pipe(alsFilter.restore())
    //    .pipe(gulp.dest($.config.ingest.output))
});


// OGG Decode
gulp.task('oggdec', function() {
  return gulp.src($.config.get("oggdec.input"), { buffer: false })
    .pipe($.args.force ? $.through() : $.hasChanged($.config.getRaw("oggdec.output"))) // only process new/changed files
    .pipe($.oggdec())
});

// Extract meta
gulp.task('meta', function() {
  return gulp.src($.config.get("meta.input"), { buffer: false })
    .pipe($.args.force ? $.through() : $.hasChanged($.config.getRaw("meta.output"))) // only process new/changed files
    .pipe($.meta())
});

// Explode one multichannel to many mono files
gulp.task('explode', function() {
  return gulp.src($.config.get("explode.input"), { buffer: false })
    //.pipe($.debug({ verbose: true }))
    .pipe($.args.force ? $.through() : $.hasChanged($.config.getRaw("explode.output"), { tracknum: 1 })) // only process new/changed files
    .pipe($.explode());
});

gulp.task('als2json', function() {
  return gulp.src($.config.get("als2json.input"), { buffer: false })
    .pipe($.args.force ? $.through() : $.hasChanged($.config.getRaw("als2json.output"))) // only process new/changed files
    .pipe($.als2json($.config.getRaw("als2json.output")));
});

gulp.task('als2daw', function() {
  return gulp.src($.config.get("als2daw.input"), { buffer: false })
    .pipe($.args.force ? $.through() : $.hasChanged($.config.getRaw("als2daw.output"))) // only process new/changed files
    .pipe($.als2daw($.config.getRaw("als2daw.output")));
});

gulp.task('test3', function() {

  var jsonFilter = $.filter('**/*.json');
  var xmlFilter = $.filter('**/*.xml');

  function outputPath(baseName, ext) {
    return './' + baseName + '/json/' + baseName + ext;
  }

  return gulp.src([
    '**/*.als.json'
    ], { cwd: $.config.get('paths.als') })
    .pipe($.through(function(file) {
      var stream = this;
      $.util.log("Ra Exploding ALS JSON file: " + file.path);
      var json = JSON.parse(file.contents);
      var alsProject = require('./lib/formats/als').fromJSON(json);
      var liveSet = alsProject.liveSet;
      var tracks = liveSet.tracks;
      var baseName = path.basename(file.path, '.als.json');

      _.each(tracks, function(track, index) {

        var trackFile = new $.util.File();
        trackFile.contents = new Buffer(JSON.stringify(track.data, null, 2));
        trackFile.path = outputPath(baseName, ".track" + $.pad(index, 2) + ".json");
        stream.queue(trackFile);

        //track.setName( "haxor" + index);
      });

      var scenes = liveSet.scenes;
      _.each(scenes, function(scene, sceneIndex) {
        var sceneFile = new $.util.File();
        sceneFile.contents = new Buffer(JSON.stringify(scene.data, null, 2));
        sceneFile.path = outputPath(baseName, ".scene" + $.pad(sceneIndex, 2) + ".json");
        stream.queue(sceneFile);

        _.each(tracks, function(track, trackIndex) {
          var clip = track.getClip(sceneIndex);
          if (clip) {
            //clip.setName('Clip.' + sceneIndex + '.' + trackIndex);
            var clipFile = new $.util.File();
            clipFile.contents = new Buffer(JSON.stringify(clip.data, null, 2));
            clipFile.path = outputPath(baseName, ".clip-s" + $.pad(sceneIndex, 2) + "-t" + $.pad(trackIndex, 2) + ".json");
            stream.queue(clipFile);
          }
        });
      });
      var data = JSON.stringify(alsProject.data, null, 2);
      file.contents = new Buffer(data);
      this.queue(file);
      $.util.log("End explosion");
    })) 
   // .pipe(jsonFilter.restore())
    .pipe($.through(function(file) {
      $.util.log("Here: " + path.extname(file.path));
      if (path.extname(file.path) === '.json') {
        var xmlFile = file.clone();
        xmlFile.path = xmlFile.path.replace(/json/g, 'xml');
        //xmlFile.base = xmlFile.base.replace('json', 'xml');
        $.util.log("Adding XML file: " + xmlFile.path + ", " + xmlFile.base);
        this.queue(xmlFile);
      }
      $.util.log("Just passing through: " + file.path);

      this.queue(file);
    }))
    .pipe(xmlFilter)
    .pipe($.json2xml())
    .pipe(xmlFilter.restore())
    .pipe(gulp.dest($.config.get('paths.outbox')));
    

});


gulp.task('test2', function(cb) {

  var alsProject;
  var wavFilter = $.filter('**/*.wav');
  var alsFilter = $.filter('**/*.als');


  gulp.src($.config.get('paths.templates') + '/Untitled.als.json')
    .pipe($.through(function(file) {
      var json = JSON.parse(file.contents);
      alsProject = require('./lib/formats/als').fromJSON(json);
      $.util.log("Parsed ALS file");
    }))
    .on('end', function() {
      $.util.log("reading wavs");
      gulp.src($.config.get('paths.folders') + '/**/*.wav', { read: false })
        .pipe($.debug({ verbose: true }))

        .pipe($.through2.obj(function(file, enc, next) {
          $.util.log("Getting duration for: " + file.path);
          $.sox.duration(file.path, function(duration) {
            $.util.log("duration is " + duration);
            var fileProps = $.fileProps(file);
            var liveSet = alsProject.liveSet;
            var track = liveSet.addTrack(fileProps.folder);
            $.util.log("Calling next");
            next();
          });
        }))
        .on('data', function() {
          $.util.log("Got data");
        })
        .on('end', function() {
          $.util.log("Writing new ALS file out")
          var file = new $.util.File();
          var data = JSON.stringify(alsProject.data, null, 2);
          file.contents = new Buffer(data);
          //file.base = $.config.get('paths.folders');
          file.path = $.config.get('paths.outbox') + '/test2.als'
      
          var stream = $.through()
            .pipe(gulp.dest($.config.get('paths.outbox')))
            .on('data', function() {
              $.util.log('data is pullling');
              cb();
            })
            .on('end', function() {
              $.util.log("thats all folks")
              //cb();
            });

          stream.write(file);



        })


    });
});

gulp.task('test1', function() {

  var jsonFilter = $.filter('**/*.als.json');

  return gulp.src([
    '**/*',
    '!**/*.als'
    ], { cwd: $.config.get('paths.als') })
    .pipe(jsonFilter)
    .pipe($.through(function(file) {
      $.util.log("Exporting ALS file: " + file.path);
      var json = JSON.parse(file.contents);
      var alsProject = require('./lib/formats/als').fromJSON(json);
      var liveSet = alsProject.liveSet;
      var tracks = liveSet.tracks;
      _.each(tracks, function(track, index) {
        track.setName( "haxor" + index);
      });

      var scenes = liveSet.scenes;
      _.each(scenes, function(scene, sceneIndex) {
        _.each(tracks, function(track, trackIndex) {
          var clip = track.getClip(sceneIndex);
          if (clip) {
            clip.setName('Clip.' + sceneIndex + '.' + trackIndex);
          }
        });
      });
      var data = JSON.stringify(alsProject.data, null, 2);
      file.contents = new Buffer(data);
      this.queue(file);
    }))
    .pipe($.json2xml())
   // .pipe($.debug({ verbose: true }))
    .pipe($.tRename('<%= folder %>/<%= folder %>.als', {
      extension: '.als.json'
    }))
   //.pipe($.debug({ verbose: true }))
    .pipe($.gzip({ append: false }))
    .pipe(jsonFilter.restore())
    .pipe(gulp.dest($.config.get('paths.outbox')));

});

