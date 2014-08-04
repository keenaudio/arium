assert = require "assert"
NG = require "lib/ng"

angular.module("daw").directive "dawPlayButton", () ->
  restrict: "A"
  template: require "./play_button.jade"
  scope:
    playable: "="
    loadable: "="

  link: ($scope, $elem, attr) ->
    
    # $scope.status = '';
    # $scope.state = 'loading';
    # $scope.percent = .5;
    
    # function loadAudio() {
    #   app.loadAudio($scope.url, function onProgress(percent) {
    #     $scope.$apply(function() {
    #       $scope.percent = percent;
    #       $scope.status = Math.round(percent * 100) + '%';
    #     });
    
    #   }, function onDone(data) {
    #     var audio = Object.create(WaveSurfer.WebAudio);
    #     audio.init({
    #       audioContext: app.audioContext()
    #     });
    #     audio.loadData(data, function() {
    #       $scope.$apply(function() {
    #         $scope.audio = audio;
    #         $scope.loaded = true;
    #         $scope.status = 'loaded';
    #         $scope.state = 'playing';
    #       });
    #     });
    #   });
    
    # }
    updateState = ->
      prev = $scope.state
      if loading()
        $scope.state = "loading"
      else
        $scope.state = (if $scope.playable then $scope.playable.state else "empty")
      console.log "playButton: state " + prev + " => " + $scope.state
      return
    loading = ->
      loadable = $scope.loadable
      return false  unless loadable
      loadable.loading
    loaded = ->
      loadable = $scope.loadable
      return true  unless loadable
      loadable.loaded
    play = ->
      playable = $scope.playable
      assert playable, "need a playable object"
      playable.play()
      return
    
    # if (!$scope.loaded) {
    #   $scope.state = 'loading';
    #   loadAudio();
    #   return;
    # }
    propListener = (prop, val, prev) ->
      console.log "CHANGE: " + prop + " : " + val + " : " + prev
      updateState()
      return
    attachReceiver = (cur, prev) ->
      receiver.stopListening "change", prev  if prev and prev isnt cur
      receiver.listen "change", cur  if cur
      return
    NG.attachScopeToElem $scope, $elem
    $scope.state = "init"
    receiver = new NG.Receiver($scope)
    $scope.onClick = ->
      return  if loading()
      unless loaded()
        console.log "play button: Loading clip and then playing"
        $scope.loadable.load play
        return
      play()
      return

    $scope.$watch "playable", attachReceiver
    $scope.$watch "loadable", attachReceiver
    $scope.$watch "playable.state", updateState
    $scope.$watch "loadable.loading", updateState
    return


