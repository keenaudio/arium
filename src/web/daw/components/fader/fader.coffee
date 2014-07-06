define [
  "assert"
  "daw/module"
  "angular"
  "ng"
  "ng/receiver"
], (assert, module, angular, NG, Receiver) ->
  angular.module(module["name"]).directive "dawFader", ($http, $routeParams) ->
    restrict: "A"
    scope:
      track: "="
      node: "="

    templateUrl: "components/fader/fader.jade"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      
      $scope.receiver = new Receiver($scope)

      attachReceiver = (cur, prev) ->
        if prev and prev != cur
          $scope.receiver.stopListening "change", prev
        
        if cur
          $scope.receiver.listen "change", cur
        return

      $scope.$watch "track", attachReceiver
      $scope.$watch "track.volume", (value) ->
        return if !value
        console.log "Saw track volume change: " + value + " , my level is: " + $scope.level
        $scope.level = value * 100
        return

      $scope.level = 80
      $scope.$watch "level", (level) ->
        assert not isNaN(level) #@strip
        val = level / 100
        console.log "Fader: setting value: " + val + " on node: " + $scope.node
        track = $scope.track
        if track
          track.setVolume val
        else if $scope.node
          $scope.node.gain.value = val
          
        return

      return

  return
