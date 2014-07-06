
module.exports = function($) {
  var path = $.path;
  return function fileProps(file, extraProps) {
    var ext = path.extname(file.path);
    var folder = path.basename(file.path, ext);
    var filename = folder + ext;
    var props = {
      $: $,
      config: $.config,
      file: file,
      folder: folder,
      filename: filename
    };
    if (extraProps) {
      $.merge(props, extraProps)
    }
    return props;
  }
}
