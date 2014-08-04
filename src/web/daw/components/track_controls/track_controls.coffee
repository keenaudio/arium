NG = require "lib/ng"

angular.module("daw").directive "dawTrackControls", ($http, $routeParams) ->
  restrict: "A"
  scope:
    track: "="
  template: require "./track_controls.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    return
