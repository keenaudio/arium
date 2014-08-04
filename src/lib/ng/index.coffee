module.exports = 
  config: require("./config")
  Receiver: require("./receiver")
  attachScopeToElem: ($scope, $elem) ->
    elem = $elem[0]
    elem.$scope = $scope
