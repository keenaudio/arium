define(['angular'], function(angular) {


  var NG = {

    // Enable viewing the '_scope' property on DOM elements in browser developer tools
    attachScopeToElem: function($scope, $elem) {
    //  assert($scope); //@strip
   //   assert($elem); //@strip
   //   assert($elem.length === 1); //@strip
      var elem = $elem[0];
    //  assert(!elem.$scope, "Scope was already added"); //@strip
      elem.$scope = $scope;
    }
  }

  return NG;

});

// Global
