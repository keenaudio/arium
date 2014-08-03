assert = require "assert"
Playable = require "./playable"

_f = (msg) ->
  "Clip: " + msg

class Clip extends Playable
  constructor: (@sample, @track) ->
    super("Clip")
    @loaded = false
    @source = false
    @startOffset = 0
    return
  load: (cb) ->
    @startLoading()

    that = this

    onLoad = (err) ->
      that.finishLoading()
      if err
        console.error "Error loading sample: " + that.sample.url + " : " + err
      else
        console.log "Loaded clip sample: " + that.sample.url
        buffer = that.sample.buffer
        assert buffer, "Sample has no buffer"
        numChannels = buffer.numberOfChannels
        that.track.setNumChannels numChannels
      cb err
      return

    onProgress = (percent) ->
      that.setPercentComplete(percent)
      console.log "Loading " + (that.percentComplete * 100) + "%"
      return

    @sample.load onLoad, onProgress
    return

  onStateChange: (state, prev) ->
    console.log _f "onStateChange " + prev + " => " + state
    super(state, prev)
    ac = @track.audioContext
    if state is 'playing'
      console.log "Starting audio source: " + @sample.url
      source = ac.createBufferSource()
      dest = @track.nodes.input
      source.connect dest
      source.buffer = @sample.buffer
      @source = source
      offset = 0
      if @startOffset
        offset = @startOffset % source.buffer.duration
        console.log "Starting with offst: " + offset + " (" + @startOffset + ")"

      @playTime = ac.currentTime
      @source.start 0, offset
    else

      if prev is 'playing' && state is 'paused'
        @startOffset += ac.currentTime - @playTime
        console.log "Set startOffset: " + @startOffset + " ac.currentTime: " + ac.currentTime + " playTime: " + @playTime
      else
        @startOffset = 0
        console.log "Resetting startOffset to 0"

      console.log "Stopping audio source: " + @sample.url
      @source.stop 0
    return
    
module.exports = Clip

