var assert = require('assert');

var AbletonProject = function(data) {
  this.data = data;
  this.liveSet = new LiveSet(this, data.Ableton.LiveSet[0]);
  this.props = data.Ableton.$;
};

AbletonProject.prototype.toDAWFormat = function(options) {
  return {
    msg: "hello, print it up"
  };
}

var LiveSet = function(parent, data) {
  this.parent = parent;
  this.data = data;
  var set = this;
  var tracks = [];
  this.rawTracks = data.Tracks[0].AudioTrack;
  this.tracks = _.map(this.rawTracks, function(track, index) {
    return new AudioTrack(set, track, index);
  });
  var sceneNames = data.SceneNames[0].Scene;
  this.scenes = _.map(sceneNames, function(scene, index) {
    return new Scene(set, scene, index);
  });
}
LiveSet.prototype.addTrack = function(name) {
  var newTrack = {
    Name: [{
      UserName: [{
        $: {
          Value: name
        }
      }]
    }]
  };
};

var Scene = function(parent, data, index) {
  this.parent = parent;
  this.data = data;
  this.index = index;
  this.name = data.$.Value;
}

var AudioTrack = function(parent, data, index) {
  this.parent = parent;
  this.data = data;
  this.index = index;
  this.name = data.Name[0].UserName[0].$.Value;

  var track = this;
  var slots = [];
  var rawSlots = data.DeviceChain[0].MainSequencer[0].ClipSlotList[0].ClipSlot;
  _.each(rawSlots, function(slot, index) {
    slots.push(new ClipSlot(track, slot, index));
  });
  this.slots = slots;
}

AudioTrack.prototype.setName = function(name) {
  this.name = this.data.Name[0].UserName[0].$.Value = name;
}

AudioTrack.prototype.getClip = function(slotIndex) {
  if (slotIndex < this.slots.length) {
    var slot = this.slots[slotIndex];
    return slot.clip;
  }
  return undefined;
}

var ClipSlot = function(parent, data, index) {
  this.parent = parent;
  this.data = data;
  this.index = index;
  var clip = data.ClipSlot[0].Value[0];
  this.clip = clip ? new Clip(this, clip) : undefined;
}

var Clip = function(parent, data) {
  this.parent = parent;
  this.data = data;
  if (data.AudioClip) {
    this.audioClip = data.AudioClip[0];
    this.sample = this.audioClip.SampleRef ? new Sample(this, this.audioClip.SampleRef[0]) : undefined;
    this.name = this.audioClip.Name[0].$.Value;
  } else {
    debugger;
  }
}
Clip.prototype.setName = function(name) {
  this.name = this.audioClip.Name[0].$.Value = name;
}

var Sample = function(parent, data) {
  this.parent = parent;
  this.data = data;
  this.fileRef = new FileRef(this, data.FileRef[0]);
  this.duration = data.DefaultDuration[0].$.Value;
}

var FileRef = function(parent, data) {
  this.parent = parent;
  this.data = data;
  this.fileName = data.Name[0].$.Value;

  var relPathElems = data.RelativePath[0].RelativePathElement;
  var pathSegments = _.map(relPathElems, function(elem) {
    return elem.$.Dir;
  });
  this.fileRelPath = pathSegments.join('/');
}


module.exports = AbletonProject;