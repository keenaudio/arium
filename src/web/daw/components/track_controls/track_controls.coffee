angular.module("daw").directive "dawTrackControls", ($http, $routeParams) ->
  restrict: "A"
  scope:
    track: "="
  templateUrl: "components/track_controls/track_controls.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    return
