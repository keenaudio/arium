define ["assert"], (assert) ->

  _f = (msg) ->
    "[dispatcher.js] " + msg

  _addHandler = (map, key, handler) ->
    assert map and typeof map is "object" #@strip
    assert key and typeof key is "string" #@strip
    handlers = map[key]
    unless handlers
      handlers = []
      map[key] = handlers
    
    #@if DEBUG
    i = 0

    while i < handlers.length
      h = handlers[i]
      assert false, "handler is already bound to key " + key  if h is handler #@strip
      i++
    
    #@end
    handlers.push handler
    return
  _removeHandler = (map, key, handler) ->
    assert map and typeof map is "object" #@strip
    assert key and typeof key is "string" #@strip
    handlers = map[key]
    assert handlers #@strip
    found = false #@strip
    i = 0

    while i < handlers.length
      h = handlers[i]
      if h is handler
        handlers.splice i, 1
        console.log _f(this + " removeHandler: " + key) #@strip
        found = true #@strip
        break
      i++
    assert found, this + " Attempt to remove handler for key '" + key + "' but it was not in the handlers list" #@strip
    return
  _triggerHandler = (map, key, data) ->
    assert map and typeof map is "object" #@strip
    assert key and typeof key is "string" #@strip
    handlers = map[key]
    return  unless handlers
    assert handlers instanceof Array #@strip
    args = (if (data instanceof Array) then data else [data])
    i = 0

    while i < handlers.length
      h = handlers[i]
      h.apply this, args
      i++
    return

  
  class Dispatcher
    constructor: (label) ->
      assert label, "Label is required"
      console.log "Creating dispatcher: " + label
      @_d =
        events: {}
        props: {}

      return
  
    triggerEventsOn: (dispatcher) -> # fire all events through another dispatcher
      assert dispatcher and dispatcher.triggerHandler #@strip
      @dispatchUsing = dispatcher
      return

    addHandler: (event, handler) ->
      assert event and typeof event is "string" #@strip
      assert handler and typeof handler is "function" #@strip
      assert @_d #@strip
      _addHandler @_d.events, event, handler
      return

    addHandlers: (obj) ->
      assert typeof obj is "object" #@strip
      for p of obj
        assert typeof obj[p] is "function" #@strip
        @addHandler p, obj[p]
      return

    removeHandler: (event, handler) ->
      _removeHandler @_d.events, event, handler
      return

    removeHandlers: (obj) ->
      assert typeof obj is "object" #@strip
      for p of obj
        assert typeof obj[p] is "function" #@strip
        @removeHandler p, obj[p]
      return

    triggerHandler: (event, data) ->
      _triggerHandler @_d.events, event, data
      @dispatchUsing.triggerHandler event, data  if @dispatchUsing
      return

    notifyChange: (prop, value, old_value) ->
      if @_d.props[prop]
        _triggerHandler @_d.props, prop, [
          value
          old_value
        ]
      
      @triggerHandler "change", [
        prop
        value
        old_value
      ]
      return

    bindProp: (prop, handler) ->
      assert prop and typeof prop is "string" #@strip
      assert handler and typeof handler is "function" #@strip
      _addHandler @_d.props, prop, handler
      return

    unbindProp: (prop, handler) ->
      _removeHandler @_d.props, prop, handler
      return

    unbindAll: ->
      @initDispatcher()
      return
