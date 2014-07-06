define ["dispatcher", "audio/panner"], (Dispatcher, Panner) ->
  _f = (msg) ->
    "Track: " + msg

  class Track extends Dispatcher
    constructor: (audioContext, masterGainNode) ->
      super("Track")
      ac = @audioContext = audioContext

      input = ac.createGain()
      volume = ac.createGain()
      #panner = ac.createPanner()
      output = ac.createGain()
      
      #panner.panningModel = "equalpower"
      #panner.setPosition(1,0,0)
      panner = new Panner(volume)

      input.connect volume
      #volume.connect panner
      panner.nodes.output.connect output

      @output = 1
      @panner = panner
      @nodes =
        input: input
        volume: volume
        #panner: panner
        output: output

      @clips = []

      @solo = false
      @mute = false
      @numChannels = 2

      return
    setOutput: (value) ->
      prev = @output
      if prev == value
        console.log _f("Track %i output is unchanged at %s"), @id, value
        return

      @output = value
      @nodes.output.gain.value = if value then 1 else 0
      @notifyChange "output", @output, prev
      return

    addClip: (clip, index) ->
      console.log "Adding clip " + clip + " at index " + index
      @clips[index] = clip
      return

    getClip: (index) ->
      clip = @clips[index]
      #console.log "Getting clip at index " + index + " : " + clip
      return clip

    setSolo: (value) ->
      prev = @solo
      if prev == value
        console.log _f("Track %i solo is unchanged at %s"), @id, value
        return

      @solo = value
      @notifyChange "solo", @solo, prev


      if @linkedTo
        console.log _f("Setting solo on track: %i : %s"), @linkedTo.id, value
        @linkedTo.setSolo value

      return

    soloToggle: () ->
      console.log _f "soloToggle, was: " + @solo
      @setSolo not @solo
      return

    setMute: (value) ->
      prev = @mute
      if prev == value
        console.log _f("Track %i mute is unchanged at %s"), @id, value
        return

      @mute = value
      @notifyChange "mute", @mute, prev

      if @linkedTo
        console.log _f("Setting mute on track: %i : %s"), @linkedTo.id, value
        @linkedTo.setMute value

      return

    muteToggle: () ->
      console.log _f "muteToggle, was: " + @mute
      @setMute not @mute
      return

    setNumChannels: (numChannels) ->
      prev = @numChannels
      @numChannels = numChannels
      console.log _f("Changing numChannels %i => %i"), prev, @numChannels
      input = @nodes.input
      volume = @nodes.volume
      input.channelCount = numChannels
      # input.disconnect volume
      if numChannels is 1
        console.log _f("Connecting input to volume as dual mono")
        # input.connect volume, 0, 0
        # input.connect volume, 0, 1
        @panner.setDualMono()
      else
        console.log _f("Connecting input to volume as stereo")
        #input.connect volume
        @panner.setStereo()
      @notifyChange "numChannels", @numChannels, prev
      return

    getVolume: ->
      @volume = @nodes.volume.gain.value
      console.log _f("track %i, getVolume: "), @id, @volume
      return @volume

    setVolume: (value) ->
      prev = @nodes.volume.gain.value
      if prev == value
        console.log _f("Track %i volume is unchanged at %s"), @id, value
        return

      @volume = value
      @nodes.volume.gain.value = value
      @notifyChange "volume", value, prev

      if @linkedTo
        console.log _f("Setting volume on track: %i : %s"), @linkedTo.id, value
        @linkedTo.setVolume value

      return

    linkTo: (track, pan=0, volume=0) ->
      if @linked
        console.log _f("linkTo: %i, already linked"), @id
        return

      if not volume
        console.log _f("track %i, no volume passed, getting value from volume node"), @id
        volume = @getVolume()

      console.log _f("track %i linkTo: %i, pan: %i, volume: %s"), @id, track.id, pan, volume
      @linked = true
      @linkedTo = track
      @panner.setValue pan
      @setVolume volume
      track.linkTo this, 1 - pan, volume
      return

    unlink: ->
      if not @linked
        console.log _f("track %i, not linked"), @id
        return

      console.log _f("unlink %i, linked: %s, linkedTo: %s"), @id, @linked, @linkedTo
      @linked = false
      @linkedTo.unlink()
      delete @linkedTo
      return

  # export
  return Track
