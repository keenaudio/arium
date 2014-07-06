# require.config
#     paths:
#         dawTemplates: "daw/scripts/daw-templates"

#     shim:
#         dawTemplates:
#           deps: ["angular"]
#           exports: "angular"

define [
  "./module"
  "./views/project/project"
  "./components/fader/fader"
  "./components/play_button/play_button"
  "./components/play_clip/play_clip"
  "./components/set/set"
  "./components/vu_meter/vu_meter"
  "./components/track_header/track_header"
  "./components/track_controls/track_controls"
  "./components/master_controls/master_controls"
  "./components/panner/panner"
  "./components/track_mixer/track_mixer"
], (daw) ->
  console.log "DAW module loaded"
  return daw