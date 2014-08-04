require "lib"
require "daw"

#@if LOG
_ls = "App.app"
_f = (msg) ->
  "[" + _ls + "] " + msg

#@end
locals = {}

# Define the app instance.
app = angular.module("app", [ # Module dependencies
  "ngRoute"
  "config"
  "daw"
])

app.config ($routeProvider, $locationProvider) ->
  $routeProvider
  .when "/",
    template: require "./views/main/main.jade"
  .when "/folders",
    template: require "./views/folders/folders_index.jade"
  .when "/folder/:folder",
    template: require "./views/folders/folder.jade"
  .when "/als",
    template: require "./views/als/als_index.jade"
  .when "/als/project/:project",
    template: require "./views/als/als_project.jade"
  .when "/library/:folder/:file",
    template: require "./views/library/library.jade"
  .otherwise redirect: "/"
  return


# configure html5 to get links working on jsfiddle
#$locationProvider.html5Mode(true);
app.service "app", ($rootScope) ->
  svc =
    showOverlay: (name, props) ->
      if name
        $("#overlay").addClass("visible")
      else
        $("#overlay").removeClass("visible")
        $rootScope.overlay = false
        return
        
      $rootScope.overlay =
        name: name
        props: props or {}

      return

  $rootScope.closeOverlay = ->
    svc.showOverlay false
    return
    
  return svc

app.run ($rootScope) ->
  console.log _f("keenaudio app running") #@strip
  return


require "./directives/sortable"
require "./directives/overlay"
require "./components"
require "./views"

console.log "App: starting"

# Load the config, then bootstrap the app
serverConfig = window["serverConfig"]
initConfig = angular.module("config").init(serverConfig)

bootstrap = (config) ->
  console.log "Doing bootstrap now" #@strip
  angular.element(document).ready ->
    angular.bootstrap document, ["app"]
    return

  return

initConfig.then bootstrap if initConfig
