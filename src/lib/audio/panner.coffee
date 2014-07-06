define ["dispatcher"], (Dispatcher) ->
  _f = (msg) ->
    "Panner: " + msg

  class Panner extends Dispatcher
    constructor: (inputNode) ->
      super("Panner")
      ac = inputNode.context
      splitter = ac.createChannelSplitter(2)
      inputNode.connect splitter

      @value = .5;
      left = ac.createGain()
      left.channelCount = 1
      left.gain.value = .5
      splitter.connect left, 0, 0

      right = ac.createGain()
      right.channelCount = 1
      right.gain.value = .5
      splitter.connect right, 1, 0

      merger = ac.createChannelMerger(2)
      left.connect merger, 0, 0
      right.connect merger, 0, 1

      @nodes =
        input: inputNode
        splitter: splitter
        left: left
        right: right
        output: merger
      return
    setValue: (value, range=1) ->
      prev = @value
      rval = value/range
      lval = 1 - rval
      console.log _f("setValue: %s, r: %s, l: %s"), value, rval, lval
      @nodes.left.gain.value = lval
      @nodes.right.gain.value = rval
      @value = rval
      @notifyChange "value", @value, prev
      return
    getValue: ->
      return @value

    setDualMono: () ->
      console.log _f("setDualMono")
      splitter = @nodes.splitter
      splitter.disconnect()

      splitter.connect @nodes.left, 0, 0
      splitter.connect @nodes.right, 0, 0
      return

    setStereo: () ->
      console.log _f("setStereo")
      splitter = @nodes.splitter
      splitter.disconnect()

      splitter.connect @nodes.left, 0, 0
      splitter.connect @nodes.right, 1, 0
      return


