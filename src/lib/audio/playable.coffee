assert = require "assert"
Loadable = require "./loadable"


_f = (msg) ->
  "Playable: " + msg

class Playable extends Loadable
  constructor: (label) ->
    super(label)
    console.log "Playable: " + 
    @state = 'paused'
    return
  isPaused: ->
    return @state == 'paused'
  isPlaying: ->
    return @state == 'playing'
  isStopped: ->
    return @state == 'stopped'

  play: () ->
    if @state == 'loading'
      console.log _f "cannot play/pause because state=loading"
      return
    if @state is "playing"
      @pause()
      return
    @setState "playing"
    return
  pause: ->
    assert @state is "playing"
    @setState "paused"
    return
  stop: ->
    @setState "stopped"
    return
  setState: (state) ->
    prev = @state
    @state = state
    console.log _f "changing state " + prev + " => " + @state
    @onStateChange @state, prev
    return
  onStateChange: (state, prev) ->
    console.log _f "onStateChange " + prev + " => " + state
    @notifyChange "state", state, prev
    return

module.exports = Playable
  