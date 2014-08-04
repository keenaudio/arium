NG = require "lib/ng"

clip2sample = (clip, baseUrl) ->
  return  unless clip
  return  unless clip.sample
  return  unless clip.sample.fileRef
  fileRef = clip.sample.fileRef
  urlParts = [
    baseUrl
    fileRef.fileRelPath
    fileRef.fileName
  ]
  sample =
    fileName: fileRef.fileName
    fileRelPath: fileRef.fileRelPath
    url: urlParts.join("/")

  sample
  
angular.module("app").directive "kAlsProjects", ($http, $routeParams) ->
  restrict: "A"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "als view loaded"
    $http.get("/json/als/projects").success (data) ->
      $scope.projects = data
      return

    return

angular.module("app").directive "kAlsProject", ($http, $routeParams, config, daw) ->
  restrict: "A"
  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "als view loaded"
    $http.get("/json/als/project/" + $routeParams.project).success (data) ->
      $scope.data = data
      $scope.name = $routeParams.project
      $scope.alsProject = new formats.Als(data)
      $scope.props = $scope.alsProject.props
      $scope.liveSet = $scope.alsProject.liveSet
      $scope.tracks = $scope.liveSet.tracks #data.Ableton.LiveSet[0].Tracks[0].AudioTrack;
      $scope.scenes = $scope.liveSet.scenes
      baseUrl = [
        config.get("routes.als")
        $routeParams.project
      ].join("/")
      project = new formats.Project($scope.name, $scope.props.Creator)
      $scope.tracks.forEach (track) ->
        project.addTrack new Project.Track(track.name)
        return

      $scope.scenes.forEach (scene) ->
        set = new formats.Project.Set(scene.name, "als")
        project.addSet set
        $scope.tracks.forEach (track) ->
          clip = track.getClip(set.id)
          sample = clip2sample(clip, baseUrl)
          set.addSample sample, track.index
          return

        return

      $scope.project = project
      daw.setProject project
      return

    return

angular.module("app").directive "kAlsScene", ($routeParams, config) ->
  restrict: "A"
  template: require "./als_scene.jade"
  scope:
    scene: "="

  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "scene view loaded: " + $scope.scene
    $scope.$watch "scene", (scene) ->
      return  unless scene
      $scope.name = scene.name
      $scope.dawJsonUrl = config.get("routes.json_api") + "/als/daw/" + $routeParams.project + "/" + $scope.scene.index
      $scope.dawUrl = config.get("routes.daw") + "/?data=" + encodeURIComponent($scope.dawJsonUrl)
      return

    return

angular.module("app").directive "kAlsTrack", ->
  restrict: "A"
  template: require "./als_track.jade"
  scope:
    track: "="
    showHeader: "@"

  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "track view loaded: " + $scope.track
    $scope.$watch "track", (track) ->
      return  unless track
      $scope.name = track.name #Name[0].UserName[0].$.Value;
      console.log "Setting name: " + $scope.name
      $scope.slots = track.slots #DeviceChain[0].MainSequencer[0].ClipSlotList[0].ClipSlot;
      return

    return

angular.module("app").directive "kAlsClipSlot", ->
  restrict: "A"
  template: require "./als_slot.jade"
  scope:
    slot: "="

  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "clipslot view loaded"
    $scope.$watch "slot", (slot) ->
      $scope.clip = slot.clip #ClipSlot[0].Value[0];
      return

    return

angular.module("app").directive "kAlsClip", ->
  restrict: "A"
  template: require "./als_clip.jade"
  scope:
    clip: "="

  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "clipslot view loaded"
    $scope.$watch "clip", (clip) ->
      unless clip
        console.log "No clip passed to k-als-clip"
        return
      console.log "Setting sample: " + clip.sample
      $scope.sample = clip.sample #AudioClip[0].SampleRef[0];
      return

    return

angular.module("app").directive "kAlsSample", ->
  restrict: "A"
  template: "./als_sample.jade"
  scope:
    sample: "="

  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "sample view loaded"
    $scope.$watch "sample", (sample) ->
      unless sample
        console.log "No Sample passed to k-als-sample"
        return
      $scope.fileRef = sample.fileRef #FileRef[0].Name[0].$.Value;
      return

    return

angular.module("app").directive "kAlsFileRef", ($routeParams, config) ->
  restrict: "A"
  template: "./als_file_ref.jade"
  scope:
    fileRef: "="

  link: ($scope, $elem, attr) ->
    NG.attachScopeToElem $scope, $elem
    console.log "fileRef view loaded"
    $scope.$watch "fileRef", (fileRef) ->
      unless fileRef
        console.log "No Fileref passed to k-als-file-ref"
        $scope.valid = false
        return
      $scope.valid = true
      urlParts = [
        config.get("routes.als")
        $routeParams.project
        fileRef.fileRelPath
        fileRef.fileName
      ]
      $scope.playClip =
        fileName: fileRef.fileName
        fileRelPath: fileRef.fileRelPath
        url: urlParts.join("/")

      return

    return


#$scope.displayPath = './' + fileRef.fileRelPath + '/' + $scope.fileName;