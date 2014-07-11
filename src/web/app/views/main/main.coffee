define ["../../module", "angular", "ng"], (module, angular, NG) ->
  angular.module(module["name"]).directive "kMain", (app) ->
    restrict: "A"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      console.log "main view loaded"

      app.showOverlay "open"
      return

  return
