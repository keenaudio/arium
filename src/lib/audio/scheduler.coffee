assert = require "assert"
Playable = require "./playable"

class AudioScheduler extends Playable
  constructor: (@audioContext) ->
    super("Scheduler")
    @items = []
    @activeItems = []
    @clipsToLoad = 0
    return

AudioScheduler::clearAll = ->
  @stopAll()
  @activeSources = []
  return

AudioScheduler::addClip = (clip, startTime) ->
  assert clip #@strip
  item =
    clip: clip
    startTime: startTime

  @items.push item
  item.id = @items.length - 1
  return item

AudioScheduler::onStateChange = (state, prev) ->
  super(state, prev)
  if state == 'playing'
    @playAll()
  else
    @stopAll()

AudioScheduler::playAll = () ->
  console.log "playAll"
  if @clipsToLoad
    console.log "AudioScheduler: cannot play beause waiting for clips to load"
    return
  currentTime = @audioContext.currentTime
  console.log "AudioScheduler: play(): " + currentTime
  @clipsToLoad = 0
  that = this
  @items.forEach (item) ->
    if item.startTime <= currentTime and item.clip.loaded is false
      that.clipsToLoad++
      clip = item.clip
      clip.load (err) ->
        that.clipsToLoad--
        assert clip.loaded #@strip
        if err
          console.error "Error loading clip: " + clip.sample.url + " : " + err
        else
          #assert clip.source #@strip
          that.activeItems.push item

        # source.start(startTime);
        that.playAll() if that.clipsToLoad is 0
        return

    return

  if @clipsToLoad
    console.log "AudioScheduler: returning from play waiting for " + @clipsToLoad + " clips to load"
    return

  console.log "AudioScheduler: playing all activeSources at currentTime"
  currentTime = @audioContext.currentTime
  @activeItems.forEach (item, index) ->
    
    #var percent = (current16thNote-element.sourceStartBar) / (element.sourceNode.buffer.duration/(secondsPerBeat*0.25));
    #element.sourceNode.start(element.sourceNode.buffer.duration * percent);
    item.clip.play currentTime
    return

  return

AudioScheduler::stopAll = ->
  console.log "stopAll"
  @activeItems.forEach (item) ->
    item.clip.stop()
    return

  return


# export
module.exports = AudioScheduler
