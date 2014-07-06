define [
  "assert"
  "daw/module"
  "angular"
  "ng"
  "ng/receiver"
], (assert, module, angular, NG, Receiver) ->
  angular.module(module["name"]).directive "dawPanner", ($http, $routeParams) ->
    restrict: "A"
    scope:
      panner: "="

    templateUrl: "components/panner/panner.jade"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
        
      # setValue = (value, range) ->
      #   rval = value/range
      #   lval = 1 - rval
      #   console.log _f("setValue: %s, r: %s, l: %s"), value, rval, lval
      #   $scope.panner.setPosition lval, 0, rval

      $scope.receiver = new Receiver($scope)

      attachReceiver = (cur, prev) ->
        if prev and prev != cur
          $scope.receiver.stopListening "change", prev
        
        if cur
          $scope.receiver.listen "change", cur
        return

      $scope.$watch "panner", attachReceiver


      $scope.value = 50
      $scope.$watch "value", (value) ->
        assert not isNaN(value) #@strip
        console.log "Panner: setting value: " + value + " on panner: " + $scope.panner
        $scope.panner.setValue(value, 100) if $scope.panner
        #$scope.node.gain.value = val  if $scope.node
        return

      $scope.$watch "panner.value", (value) ->
        console.log "Saw panner value change: " + value + " , my value is: " + $scope.value
        $scope.value = value * 100
        return

      $scope.pan = (val) ->
        $scope.value = val
        return
      return

  return
