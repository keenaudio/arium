
angular.module("app").directive "kFolders", ($http) ->
  restrict: "A"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $http.get("/json/folders").success (data) ->
      $scope.folders = data
      return

    return

angular.module("app").directive "kFolder", ($http, $routeParams, config, daw) ->
  restrict: "A"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.name = $routeParams.folder
    $http.get("/json/folder/" + $routeParams.folder).success (data) ->
      $scope.files = data
      $scope.tracks = _.map(data, (file) ->
        name: file
      )
      $scope.samples = _.map(data, (file) ->
        fileName: file
        url: config.get("routes.folders") + "/" + $routeParams.folder + "/" + file
      )

      project = new formats.Project($scope.name, "wavs")
      $scope.tracks.forEach (track) ->
        project.addTrack new Project.Track(track.name)
        return

      set = new formats.Project.Set($scope.name, "wav")
      $scope.samples.forEach (sample, index) ->
        set.addSample sample, index
        return

      project.addSet set
      project.addSet new formats.Project.Set("Empty 1", "wav")
      
      $scope.project = project
      daw.setProject project
      return

    return


# app.clearAudio();
# var mixer = app.getMixer();
# var scheduler = app.getScheduler();

# _.each($scope.clips, function(clip) {
#   var sample = audio.createSample(clip);
#   var track = mixer.createTrack();
#   scheduler.addItem(sample, track, 0);
# });
angular.module("app").directive "kFile", ($routeParams, config) ->
  restrict: "A"
  templateUrl: "views/folders/file.jade"
  scope:
    file: "="

  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.$watch "file", (file) ->
      return  unless file
      $scope.fileName = file
      $scope.url = config.get("routes.folders") + "/" + $routeParams.folder + "/" + file
      return

    return

