{NG,Audio} = require "lib"

angular.module("daw").directive "dawSet", ($http, $routeParams, daw) ->
  restrict: "A"
  scope:
    set: "="

  template: require "./set.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.playable = new Audio.Playable("Set")
    $scope.$watch "playable.state", (state, prev) ->
      console.log "Set playable.state: " + prev + " => " + state
      if state is "playing"
        daw.playSet $scope.set
      else daw.pauseSet $scope.set  if state is "paused"
      return

    return

