NG = require "lib/ng"

angular.module("daw").directive "dawTrackMixer", (daw) ->
  restrict: "A"
  replace: true
  scope:
    track: "="
  template: require "./track_mixer.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.daw = daw
    return


