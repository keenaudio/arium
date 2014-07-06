define [
  "audio/playable"
  "audio/loadable"
  "audio/sample"
  "audio/track"
  "audio/clip"
  "audio/mixer"
  "audio/scheduler"
], (Playable, Loadable, Sample, Track, Clip, Mixer, Scheduler)->
  ac = new (window.AudioContext or window.webkitAudioContext)
  audio =
    context: ->
      ac

    createMixer: ->
      new Mixer(ac)

    createSample: (props) ->
      new Sample(ac, props)

    createScheduler: ->
      new Scheduler(ac)

    Playable: Playable
    Clip: Clip

  return audio
