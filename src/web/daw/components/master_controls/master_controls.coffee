assert = require "assert"

angular.module("daw").directive "dawMasterControls", (daw) ->
  restrict: "A"
  templateUrl: "components/master_controls/master_controls.jade"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.mixer = daw.mixer
    return
    

