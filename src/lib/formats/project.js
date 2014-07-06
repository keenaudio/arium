if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['underscore', 'assert'], function(_, assert) {

  Project = function(name, type) {
    this.name = name;
    this.type = type;
    this.sets = [];
    this.tracks = [];
  };

  Project.prototype.addSet = function(set) {
    this.sets.push(set);
    set.id = this.sets.length - 1;
  }


  Project.prototype.addTrack = function(track) {
    this.tracks.push(track);
    track.id = this.tracks.length - 1;
  }

  var Set = function(name, type) {
    this.name = name;
    this.type = type;
    this.samples = {};
  }

  Set.prototype.addSample = function(sample, trackId) {
    this.samples[trackId] = sample;
  }


  Set.prototype.getSample = function(trackId) {
    return this.samples[trackId];
  }

  var Track = function(name, type) {
    this.name = name;
    this.type = type;
  }

  Project.Set = Set;
  Project.Track = Track;


  return Project;

});