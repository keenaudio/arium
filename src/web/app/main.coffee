# require.config
#     paths:
#         appTemplates: "app/scripts/app-templates"

#     shim:
#         appTemplates:
#           deps: ["angular"]
#           exports: "angular"

define [
    "angular"
    "ng/config"
    "angularRoute"
    "appTemplates"
    "./module"
    "./directives/sortable"
    "./directives/overlay"
    "./views/main/main"
    "./views/als/als"
    "./views/folders/folders"
    # "views/project/project"
    "./views/export/export"
    # "components/fader/fader"
    "./components/main_nav/main_nav"
], (angular, config, ngRoute, appTemplates, app) ->
    console.log "App: starting"

    # Load the config, then bootstrap the app
    serverConfig = window["serverConfig"]
    initConfig = angular.module("config").init(serverConfig)

    bootstrap = (config) ->
      console.log "Doing bootstrap now" #@strip
      angular.element(document).ready ->
        angular.bootstrap document, [app["name"]]
        return

      return

    initConfig.then bootstrap if initConfig
    return