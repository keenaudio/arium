define ["../../module", "angular", "ng"], (module, angular, NG) ->
  angular.module(module["name"]).directive "kOpen", ($http, $location, config, daw) ->
    restrict: "A"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      console.log "open view loaded"

      base = config.get "routes.library"
      url = base + "/index.json"

      request = $http.get url 
      request.then (result) ->
        console.log result
        $scope.folders = result.data.folders
        $scope.folder = 0 #$scope.folders[0]
        #$scope.$apply()
        return

        
      $scope.open = ->
        url = base + '/' + $scope.folders[$scope.folder] + '/' + $scope.files[$scope.file]
        console.log "open: %s", url
        $location.path url
        return

      $scope.$watch "folder", (folder) ->
        console.log "folder is", folder
        return if isNaN folder

        folderName = $scope.folders[folder]
        url = base + '/' + folderName + '/index.json'
        $scope.files = []
        request = $http.get url
        request.then (result) ->
          console.log result
          $scope.files = result.data.files.map (file) ->
            return file.replace ".json", ""
          $scope.file = 0
          return

        return
      return

  return
