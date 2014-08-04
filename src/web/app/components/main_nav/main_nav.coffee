angular.module("app").directive "kMainNav", ($http, $routeParams, app, daw) ->
  restrict: "A"
  template: require('./main_nav.jade')
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    $scope.playPause = ->
      console.log "playPause"
      daw.scheduler.play() if daw.scheduler
      return

    $scope.stop = ->
      console.log "stop"
      daw.scheduler.stopAll() if daw.scheduler
      return

    $scope.openProject = ->
      app.showOverlay "open"
      return
      
    $scope.export = ->
      # project = daw.project
      # projectTracks = project.tracks
      # mixer = daw.mixer
      # mixerTracks = mixer.tracks
      # projectTracks.forEach (pt, i) ->
      #   mt = mixerTracks[i];
      #   pt.pan = mt.panner.getValue()
      #   if mt.linked
      #     pt.link = mt.linkedTo.id
      #   return

      app.showOverlay "export",
        project: daw.project


      #console.log JSON.stringify project, null, 2
      return

    return


# $rootScope.$watch('project', function(project) {
#   $scope.project = project;
# })