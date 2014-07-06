define [
  "daw/module"
  "angular"
  "ng"
], (module, angular, NG) ->
  angular.module(module["name"]).directive "dawTrackMixer", (daw) ->
    restrict: "A"
    replace: true
    scope:
      track: "="
    templateUrl: "components/track_mixer/track_mixer.jade"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      $scope.daw = daw
      return

  return
