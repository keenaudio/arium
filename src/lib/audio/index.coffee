ac = new (window.AudioContext or window.webkitAudioContext)

Audio = 
  Playable: require "./playable"
  Loadable: require "./loadable"
  Sample: require "./sample"
  Track: require "./track"
  Clip: require "./clip"
  Mixer: require "./mixer"
  Scheduler: require "./scheduler"


module.exports =
  context: ->
    ac
  createMixer: ->
    new Audio.Mixer(ac)

  createSample: (props) ->
    new Audio.Sample(ac, props)

  createScheduler: ->
    new Audio.Scheduler(ac)

  Playable: Audio.Playable
  Clip: Audio.Clip