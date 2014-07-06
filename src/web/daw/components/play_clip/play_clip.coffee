define [
  "daw/module"
  "angular"
  "ng"
  "audio"
], (module, angular, NG, audio) ->
  angular.module(module["name"]).directive "dawPlayClip", ($http, $routeParams) ->
    restrict: "A"
    scope:
      clip: "="

    templateUrl: "components/play_clip/play_clip.jade"
    link: ($scope, $elem, attr) ->
      NG.attachScopeToElem $scope, $elem
      return

  return


# function loadAudio() {
#   app.loadAudio($scope.clip.url, function onProgress(percent) {
#     $scope.$apply(function() {
#       $scope.model.percent = percent;
#       $scope.model.status = Math.round(percent * 100) + '%';
#     });
#   }, function onDone(data) {
#     var audio = Object.create(WaveSurfer.WebAudio);
#     audio.init({
#       audioContext: app.audioContext()
#     });
#     audio.loadData(data, function() {
#       $scope.$apply(function() {
#         $scope.model.audio = audio;
#         $scope.model.loaded = true;
#        // $scope.status = 'loaded';
#         $scope.model.state = 'playing';
#       });
#     });
#   });

# }

# $scope.$watch('clip.state', function(state, prev) {
#   console.log('clip.state: ' + prev + ' => ' + state);
#   if (state === 'playing' && !$scope.model.loaded) {
#     $scope.model.state = 'loading';
#     loadAudio();
#   }
# });