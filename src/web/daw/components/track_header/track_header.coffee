angular.module("daw").directive "dawTrackHeader", ($http, $routeParams) ->
  restrict: "A"
  scope:
    track: "="

  templateUrl: "components/track_header/track_header.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.selected = false
    return
