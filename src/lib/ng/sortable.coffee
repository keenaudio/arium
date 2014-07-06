myApp.directive "sortable", ($log) ->
  restrict: "A"
  link: (scope, element, attrs) ->
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
