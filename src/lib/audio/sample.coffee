define [
  'audio/loadable'
  'node.extend'
  'audio/buffer'
], (Loadable, merge, AudioBuffer) ->
  class Sample extends Loadable
    constructor: (audioContext, props) ->
      super("Sample")
      @audioContext = audioContext
      merge this, props
      return

  Sample::load = loadAudioSample = (cb) ->
    @startLoading()
    if @buffer
      cb()
      return

    that = this
    post = (err) ->
      that.finishLoading();
      cb(err) if cb
      return

    AudioBuffer.load @url, (buffer)->
      that.audioContext.decodeAudioData buffer, ((buffer) ->
        that.setBuffer buffer
        post()
        return
      ), post
      return

    # xhr = new XMLHttpRequest()
    # xhr.open "GET", @url, true
    # xhr.responseType = "arraybuffer"
    # that = this
    # xhr.addEventListener "load", ((e) ->
    #   that.audioContext.decodeAudioData e.target.response, ((buffer) ->
    #     that.setBuffer buffer
    #     cb()  if cb
    #     return
    #   ), cb
    #   return
    # ), false
    # xhr.send()
    return

  Sample::setBuffer = (buffer) ->
    @buffer = buffer
    @notifyChange "buffer", buffer
    return

  
  # export
  return Sample
