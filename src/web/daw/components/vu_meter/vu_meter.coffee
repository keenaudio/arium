define [
  "daw/module"
  "angular"
  "ng"
], (module, angular, NG) ->
  _f = (msg) ->
    "VUMeter: " + msg

  WIDTH = 32
  MARGIN = 4
  HEIGHT = 120
  MAX = 128
  angular.module(module["name"]).directive "dawVuMeter", ($http, $routeParams) ->
    restrict: "A"
    scope:
      node: "="
      enabled: '='
      
    templateUrl: "components/vu_meter/vu_meter.jade"
    link: ($scope, $elem, attr) ->
      
      NG.attachScopeToElem $scope, $elem
      sourceNode = undefined
      splitter = undefined
      analyser = undefined
      analyser2 = undefined
      javascriptNode = undefined

      createGradient = (enabled) ->
        gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT)
        if enabled
          gradient.addColorStop 1, "#00ff00"
          gradient.addColorStop 0.2, "#ffff00"
          gradient.addColorStop 0.1, "#ff0000"
          gradient.addColorStop 0, "#ffffff"
        else
          gradient.addColorStop 1, "#333"
          gradient.addColorStop 0, "#222"

        return gradient

      # get the context from the canvas to draw on
      canvas = $elem.children().first()[0]
      ctx = canvas.getContext("2d")
      gradient = createGradient true

      timeout  = false

      clearRect = () ->
        console.log "clearRect"
        # clear the current state
        ctx.clearRect 0, 0, WIDTH, HEIGHT

      # create a gradient for the fill. Note the strange
      # offset, since the gradient is calculated based on
      # the canvas, not the specific element we draw
      setupAudioNodes = (gainNode) ->
        ac = gainNode.context
        
        # setup a javascript node
        javascriptNode = ac.createScriptProcessor(2048, 1, 1)
        
        # connect to destination, else it isn't called
        javascriptNode.connect ac.destination
        
        # setup a analyzer
        analyser = ac.createAnalyser()
        analyser.smoothingTimeConstant = 0.3
        analyser.fftSize = 1024
        analyser2 = ac.createAnalyser()
        analyser2.smoothingTimeConstant = 0.0
        analyser2.fftSize = 1024
        
        # create a buffer source node
        #sourceNode = ac.createBufferSource();
        splitter = ac.createChannelSplitter()
        
        # connect the source to the analyser and the splitter
        gainNode.connect splitter
        
        # connect one of the outputs from the splitter to
        # the analyser
        splitter.connect analyser, 0, 0
        splitter.connect analyser2, 1, 0
        
        # connect the splitter to the javascriptnode
        # we use the javascript node to draw at a
        # specific interval.
        analyser.connect javascriptNode
        javascriptNode.onaudioprocess = onaudioprocess
        return
      
      # when the javascript node is called
      # we use information from the analyzer node
      # to draw the volume
      onaudioprocess = ->
        
        # get the average for the first channel
        array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData array
        average = getAverageVolume(array)
        
        # get the average for the second channel
        array2 = new Uint8Array(analyser2.frequencyBinCount)
        analyser2.getByteFrequencyData array2
        average2 = getAverageVolume(array2)
        
        # clear the current state
        ctx.clearRect 0, 0, WIDTH, HEIGHT
        
        # set the fill style
        ctx.fillStyle = gradient
        
        # create the meters
        lh = HEIGHT * (average/MAX)
        ctx.fillRect MARGIN, HEIGHT - lh, 10, HEIGHT
        rh = HEIGHT * (average2/MAX)
        ctx.fillRect 10 + (2*MARGIN), HEIGHT - rh, 10, HEIGHT


        #if average or average2 then console.log _f("Left: %d %d, Right: %d %d"), average, lh, average2, rh
        #clearTimeout timeout if timeout
        #timeout = setTimeout clearRect, 100
        return
      getAverageVolume = (array) ->
        values = 0
        average = undefined
        length = array.length
        
        # get all the frequency amplitudes
        i = 0

        while i < length
          values += array[i]
          i++
        average = values / length
        return average

      $scope.$watch "node", (gainNode) ->
        if !gainNode
          clearRect()
          return
        setupAudioNodes gainNode
        return

      $scope.$watch "enabled", (enabled) ->
        console.log _f("enabled: %s"), enabled
        gradient = createGradient enabled
        return

      return

  return
