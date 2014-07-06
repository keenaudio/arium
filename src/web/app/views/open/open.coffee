define ["../../module", "angular", "ng"], (module, angular, NG) ->
  angular.module(module["name"]).directive "kOpen", ($http, config, daw) ->
    restrict: "A"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      console.log "open view loaded"

        
      $scope.open = ->
        console.log "open"
        return

      return

  return
