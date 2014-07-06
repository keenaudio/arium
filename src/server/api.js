var fs = require('fs');
var glob = require('glob');
var path = require('path');
var _ = require('underscore');


var Als = require('../lib/formats/als');
var Daw = require('../lib/formats/daw');

module.exports = function(config) {
	return {
    meta: function(folder, cb) {
      var filePath = path.join(config.get('paths.meta'), folder) + '.json';
      console.log("Loading meta from: " + filePath);
      fs.readFile(filePath, function(err, contents) {
        if (err) console.error(err);
        var meta = JSON.parse(contents);
        cb(err, meta);
      });
    },
		folders: function(cb) {
			fs.readdir(config.get('paths.folders'), function(err, files) {
				cb(err, files);
			});
		},
    files: function(folder, cb) {
      var folder = path.join(config.get('paths.folders'), folder);
      glob("*.wav", { cwd: folder }, function(err, files) {
        cb(err, files);
      });
    },
    alsProjects: function(cb) {
      fs.readdir(config.get('paths.als'), function(err, files) {
        cb(err, files);
      });
    },
    alsProject: function(folder, cb) { // return raw json for als project
      var filePath = _.template(config.getRaw('als2json.output'), {
        folder: folder,
        config: config
      }); 
      fs.readFile(filePath, function(err, contents) {
        if (err) console.error(err);
        var json = JSON.parse(contents);
        cb(err, json);
      });
    },
    alsDaw: function(projectName, sceneIndex, cb) {
      var filePath = _.template(config.getRaw('als2json.output'), {
        folder: projectName,
        config: config
      }); 
      console.log("Reading file: " + filePath);
      fs.readFile(filePath, function(err, contents) {
        if (err) console.error(err);
       // console.log("file contents: " + contents);
        var json = JSON.parse(contents);

        var alsProject = Als.fromJSON(json);
        var liveSet = alsProject.liveSet;
        var tracks = liveSet.tracks;
        var scenes = liveSet.scenes;
        var scene = scenes[sceneIndex];

        // empty daw project
        var daw = Daw.fromJSON();
        for (var i = 0; i < tracks.length; i++) {
          daw.addTrack()

          var clip = tracks[i].getClip(sceneIndex);
          if (clip) {
            var sample = clip.sample;
            var fr = sample.fileRef;
            var url = config.get('routes.als') + '/' + projectName + '/' + fr.fileRelPath + '/' + fr.fileName;
            var duration = sample.duration / 6000;
            console.log("Adding sample: " + url + " duration: " + duration);
            daw.addSample(url, duration, (i+1));
          }
        }


        cb(err, daw);
      });
    }
	}
}