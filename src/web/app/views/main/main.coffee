NG = require "lib/ng"

angular.module("app").directive "kMain", (app) ->
  restrict: "A"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "main view loaded"

    app.showOverlay "open"
    return
