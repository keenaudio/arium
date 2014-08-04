NG = require "lib/ng"

angular.module("app").directive "kSortable", ($log) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    NG.attachScopeToElem $scope, $elem
    if scope.$position is "last"
      element.ready ->
        ul = element.parent()
        $(ul).sortable "destroy"
        $(ul).sortable().bind "sortupdate", (e, ui) ->
          order = $.map($(this).find("li"), (el) ->
            $(el).attr "data-index"
          )
          scope.$apply ->
            scope.$eval attrs.sortable,
              order: order
            return
          return
        return
    return
