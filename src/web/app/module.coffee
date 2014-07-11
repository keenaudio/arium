define [
  "assert"
  "module"
  "angular"
  "audio"
  "daw/module"
  "appTemplates"
], (assert, module, angular, audio, dawModule) ->
  
  moduleName = module.config().name
  assert moduleName, "Need a module name for app"

  #@if LOG
  _ls = "App.app"
  _f = (msg) ->
    "[" + _ls + "] " + msg

  #@end
  locals = {}
  
  # Define the app instance.
  app = angular.module(moduleName, [ # Module dependencies
    "ngRoute"
    "config"
    "app-templates"
    dawModule["name"]
  ])
  app.config ($routeProvider, $locationProvider) ->
    $routeProvider.when("/",
      templateUrl: "views/main/main.jade"
    ).when("/folders",
      templateUrl: "views/folders/folders_index.jade"
    ).when("/folder/:folder",
      templateUrl: "views/folders/folder.jade"
    ).when("/als",
      templateUrl: "views/als/als_index.jade"
    ).when("/als/project/:project",
      templateUrl: "views/als/als_project.jade"
    ).when("/library/:folder/:file",
      templateUrl: "views/library/library.jade"
    ).otherwise redirect: "/"
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

  app.run ->
    console.log _f("keenaudio app running") #@strip
    return

  return app
