define [
  "assert"
  "dispatcher"
], (assert, Dispatcher) ->

  class Loadable extends Dispatcher
    constructor: (label) ->
      super(label)
      console.log "Loadable construct: " + label
      @percentComplete = 0
      @loaded = false
      @loading = false
      return
    
    isLoading: ->
      return @loading

    load: (cb) ->
      assert false, "load is pure virtual"

    # internal methods
    startLoading: ->
      assert !@loading, "Already loading"
      assert !@loaded, "Already loaded"
      @loading = true
      @notifyChange "loading", true, false
      return

    finishLoading: ->
      assert @loading, "Should be loading"
      assert !@loaded, "Already loaded"

      @loaded = true
      @notifyChange "loaded", true, false
      @loading = false
      @notifyChange "loading", false, true
      return

    setPercentComplete: (val) ->
      prev = @percentComplete
      @percentComplete = val
      @notifyChange "percentComplete", @percentComplete, prev
      return

    # loadBuffer: (url, doneCallback, progressCallback) ->
    #   assert !@loading, "Already loading"
    #   assert !@loaded, "Already loaded"
    #   @loading = true
    #   @notifyChange "loading", true, false

    #   that = this
    #   xhr = new XMLHttpRequest()
    #   xhr.open "GET", url, true
    #   xhr.responseType = "arraybuffer"
    #   xhr.addEventListener "progress", ((e) ->
    #     if e.lengthComputable
    #       that.percentComplete = e.loaded / e.total
    #     else
    #       # TODO
    #       that.percentComplete = 0
    #     progressCallback that.percentComplete, e.loaded, e.total if progressCallback
    #     return
      
    #   #my.drawer.drawLoading(percentComplete);
    #   ), false
    #   xhr.addEventListener "load", ((e) ->
    #     that.loaded = true
    #     that.notifyChange "loaded", true, false
    #     that.loading = false
    #     that.notifyChange "loading", false, true
    #     doneCallback e.target.response if doneCallback
    #     return
      
    #   # my.backend.loadData(
    #   #     e.target.response,
    #   #     my.drawBuffer.bind(my)
    #   # );
    #   ), false
    #   xhr.send()
    #   return

  return Loadable

  