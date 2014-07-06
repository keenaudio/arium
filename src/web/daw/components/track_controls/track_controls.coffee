define [
  "daw/module"
  "angular"
  "ng"
], (module, angular, NG) ->
  angular.module(module["name"]).directive "dawTrackControls", ($http, $routeParams) ->
    restrict: "A"
    scope:
      track: "="
    templateUrl: "components/track_controls/track_controls.jade"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      
  return
