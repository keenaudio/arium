define ['assert'], (assert) ->

  class Receiver
    constructor: (@scope) ->
      @listening = {}
      return
    handler: (args...) =>
      console.log "Receiver::handle: " + args.join(',')
      if @scope.$root.$$phase
        console.warn "Not calling $scope.apply because root $phase"
        return

      @scope.$apply() 
      return
    listen: (eventName, dispatcher) ->
      if @listening[eventName]?.indexOf(dispatcher) >= 0
        console.log "According to our records we are already receiving event event " + eventName + " from dispatcher: " + dispatcher
        return
      dispatcher.addHandler eventName, @handler
      @listening[eventName] = (@listening[eventName] || [])
      @listening[eventName].push(dispatcher)
      return
    stopListening: (eventName, dispatcher) ->
      if !(@listening[eventName]?.indexOf(dispatcher) >= 0)
        console.log "Attempt to removeHandler for event " + eventName + " but it was not bound to this dispatcher";
        return

      dispatcher.removeHandler eventName, @handler
      @listening[eventName] = (h for h in @listening[eventName] when h != dispatcher)
      return
    isListening: (eventName) ->
      return @listening[eventName]?.length

  return Receiver
        