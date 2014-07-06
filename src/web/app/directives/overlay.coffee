define [
  "assert"
  "../module"
  "angular"
  "ng"
], (assert, module, angular, NG) ->
  angular.module(module["name"]).directive "kOverlay", ($rootScope, $compile) ->
    restrict: "A"
    link: ($scope, $elem, attrs) ->
      NG.attachScopeToElem $scope, $elem
     
      $overlay = false
      $rootScope.$watch "overlay", (overlay, prev) ->
        console.log "Saw overlay change to: " + JSON.stringify(overlay, null, 2)
        if prev and prev != overlay
          console.log "Removing old overlay"
          $overlay.remove()

        if overlay
          console.log "Creating new overlay"
          $html = $('<div class="h100p" ng-include="\'views/' + overlay.name + '/' + overlay.name + '.jade\'"/>')
          $child = $scope.$new()
          $.extend $child, overlay.props
          $overlay = $compile($html)($child)
          $overlay[0].$scope = $child
          $elem.append $overlay
        return

      return
