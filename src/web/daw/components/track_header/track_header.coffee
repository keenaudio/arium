NG = require "lib/ng"

angular.module("daw").directive "dawTrackHeader", ($http, $routeParams) ->
  restrict: "A"
  scope:
    track: "="

  template: require "./track_header.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.selected = false
    return
