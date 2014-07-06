define [
  "daw/module"
  "angular"
  "ng"
], (module, angular, NG) ->
  angular.module(module["name"]).directive "dawMasterControls", (daw) ->
    restrict: "A"
    templateUrl: "components/master_controls/master_controls.jade"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      $scope.mixer = daw.mixer
      
  return
