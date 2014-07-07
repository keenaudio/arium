#the require library is configuring paths
require.config
  packages: [
    "app"
    "daw"
  ]
  config:
    "app/module":
      name: "app"
      
    "daw/module":
      name: "daw"

  paths:
    "node.extend": "lib/common/merge"
    ng: "lib/ng"
    audio: "lib/audio"
    formats: "lib/formats"
    # views: "../views"
    # components: "../components"
    # directives: "../directives"
    # appTemplates: "app-templates"
    #lib: "/lib"
    #merge: "lib/common/merge"
    assert: "lib/common/assert"
    dispatcher: "lib/common/dispatcher"

    #tries to load jQuery from Google's CDN first and falls back
    #to load locally
    jquery: [
      "bower_components/jquery/dist/jquery" #@strip
      "//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min"
    ]
    jqueryUI: [
      "bower_components/jquery-ui/ui/jquery-ui" #@strip
      "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min"
    ]
    underscore: [
      "bower_components/underscore/underscore" #@strip
      "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min"
    ]
    bootstrap: [
      "bower_components/bootstrap/dist/js/bootstrap" #@strip
      "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min"
    ]
    angular: [
      "bower_components/angular/angular" #@strip
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular"
    ]
    angularRoute: [
      "bower_components/angular-route/angular-route" #@strip
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular-route.min"
    ]
    angularUISlider: "bower_components/angular-ui-slider/src/slider"

    #appIndex: "/app/index"
    appTemplates: "app/templates"

    #dawIndex: "/daw/index"
    dawTemplates: "daw/templates"


  shim:
    bootstrap:
      deps: ["jqueryUI"]

    angular:
      deps: ["jquery"]
      exports: "angular"

    angularRoute: ["angular"]
    angularMocks:
      deps: ["angular"]
      exports: "angular.mock"
    angularUISlider:
      deps: ["angular", "jqueryUI"]
      exports: "angular"

    #jquery
    #  exports: "jQuery"
    jqueryUI:
      deps: ["jquery"]
      exports: "$"

    # appTemplates:
    #   deps: ["angular"]
    #   exports: "angular"

    # app:
    #   deps: [
    #     "jquery"
    #     "jqueryUI"
    #     "underscore"
    #     "bootstrap"
    #     "angular"
    #     "angularRoute"
    #     "angularUISlider"
    #     "ng/config"
    #  #   "appTemplates"
    #     "audio"
    #   ]

    app:
      deps: ["appTemplates"]

    appTemplates:
      deps: ["angular"]
      exports: "angular"


    daw:
      deps: ["dawTemplates"]
      
    dawTemplates:
      deps: ["angular"]
      exports: "angular"

  priority: ["angular"]
  
  # how long the it tries to load a script before giving up, the default is 7
  waitSeconds: 10


# requiring the scripts in the first argument and then passing the library namespaces into a callback
# you should be able to console log all of the callback arguments
require [
  "angular"
  "daw"
  "app"
], (angular, daw, app) ->
  
  console.log "Index loaded. daw: " + daw + " app: " + app

  hathBroken = false
  window["onerror"] = ()->
    debugger if !hathBroken
    hathBroken = true
    return

  return
