NG = require "lib/ng"

angular.module("app").directive "kExport", ($http, config, daw) ->
  restrict: "A"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "export view loaded"

    $scope.$watch "project", (project) ->
      $scope.text = daw.exportProject()
      $scope.saveAs = project.name + "." + new Date().getTime() + ".json"
      return
      
    $scope.post = ->
      req = $http.post config.get("routes.app") + "/post",
        filename: $scope.saveAs
        contents: $scope.text
      return

    return

