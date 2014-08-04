assert = require "assert"
NG = require "lib/ng"

angular.module("daw").directive "dawMasterControls", (daw) ->
  restrict: "A"
  template: require "./master_controls.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.mixer = daw.mixer
    return
    

