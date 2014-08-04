
assert = require "assert"
Audio = require "lib/audio"

#@if LOG
_ls = "Daw.daw"
_f = (msg) ->
  "[" + _ls + "] " + msg

#@end
locals = {}

# Define the app instance.
app = angular.module("daw", [ # Module dependencies
  "ui.slider"
  "config"
])

# configure html5 to get links working on jsfiddle
#$locationProvider.html5Mode(true);
app.service "daw", () ->

  svc =
    mixer: Audio.createMixer()
    scheduler: Audio.createScheduler()

    audioContext: ->
      Audio.context()

    loadAudio: (url, progressCallback, doneCallback) ->
      my = this
      xhr = new XMLHttpRequest()
      xhr.open "GET", url, true
      xhr.responseType = "arraybuffer"
      xhr.addEventListener "progress", ((e) ->
        if e.lengthComputable
          percentComplete = e.loaded / e.total
        else
          # TODO
          percentComplete = 0
        progressCallback percentComplete, e.loaded, e.total  if progressCallback
        return
      
        #my.drawer.drawLoading(percentComplete);
      ), false
      xhr.addEventListener "load", ((e) ->
        doneCallback e.target.response  if doneCallback
        return
      
        # my.backend.loadData(
        #     e.target.response,
        #     my.drawBuffer.bind(my)
        # );
      ), false
      xhr.send()
      return

    getMixer: ->
      svc.mixer

    getScheduler: ->
      svc.scheduler

    clearAudio: ->
      return

    setProject: (project) ->
      svc.project = project
      svc.clearAudio()
      mixer = svc.mixer
      project.tracks.forEach (trackData) ->
        track = mixer.createTrack()
        project.sets.forEach (set) ->
          sampleData = set.getSample(track.id)
          if sampleData
            sample = Audio.createSample(sampleData)
            clip = new Audio.Clip(sample, track)
            track.addClip(clip, set.id)
        return

      return

    playSet: (set) ->
      project = svc.project
      scheduler = svc.scheduler
      mixer = svc.mixer
      mixer.tracks.forEach (track) ->
        clip = track.getClip(set.id)
        if clip
          #sample = audio.createSample(sampleData)
          #clip = new audio.Clip(sample, track)
          scheduler.addClip clip, 0
        return

      scheduler.play()
      return

    pauseSet: (set) ->
      svc.scheduler.stop()
      return

    linkTrack: (track) ->
      if track.linked
        track.unlink()
        return

      mixer = svc.mixer
      tracks = mixer.tracks
      if track.id < tracks.length - 1
        nextTrack = tracks[track.id+1]
        track.linkTo nextTrack
      return

    exportProject: (options) ->
      project = svc.project
      mixer = svc.mixer

      projectTracks = project.tracks
      mixerTracks = mixer.tracks
      
      exportTracks = projectTracks.map (pt, i) ->
        mt = mixerTracks[i]
        pt.pan = mt.panner.getValue()
        if mt.linked
          pt.link = mt.linkedTo.id
        return pt

      exportStr = JSON.stringify project, (key, value) ->
        return undefined if key == "$$hashKey"
        return value

      console.log _f("exportProject")
      return exportStr

  svc.clearAudio()
  return svc

app.run ->
  console.log _f("daw app running") #@strip
  return

require "./components"
require "./views/project/project"
