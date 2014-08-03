assert = require "assert"

class Buffer
  @load: (url, doneCallback, progressCallback) ->
    that = this
    xhr = new XMLHttpRequest()
    xhr.open "GET", url, true
    xhr.responseType = "arraybuffer"
    xhr.addEventListener "progress", ((e) ->
      if e.lengthComputable
        percentComplete = e.loaded / e.total
      else
        # TODO
        percentComplete = 0
      progressCallback that.percentComplete, e.loaded, e.total if progressCallback
      return
    ), false
    xhr.addEventListener "load", ((e) ->
      doneCallback e.target.response if doneCallback
      return
    
    ), false
    xhr.send()
    return
    
# exports
module.exports = Buffer