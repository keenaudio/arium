module.exports = function($) {
  // Convert angular templates to JS
  return function html2js(config) {
    $.assert(config.src, "'src' is required");
    $.assert(config.dest, "'dest' is required");
    $.assert(config.module, "'module' is required");
    //$.assert(config.cwd, "'cwd' is required");

    var jadeFilter = $.filter("**/*.jade");
    var srcOptions = {};
    if (config.cwd) {
      srcOptions.cwd = config.cwd;
    }

    var jadeVars = {
      "NG": true,
      config: $.config
    };

    $.assert(jadeVars.config, "Jade needs config");

    console.log("HTML2JS config: " + jadeVars.config);
    return $.gulp.src(config.src, srcOptions)
      .pipe(jadeFilter)
      .pipe($.jsmacro($.options.jsmacro.client)) // unlike html, jade will be processed with jsmacro
      .pipe($.jade({
        pretty: true,
        locals: jadeVars
      }))
      //.pipe($.debug({ verbose: true }))
      .pipe(jadeFilter.restore())
      .pipe($.ngHtml2js({
        moduleName: config.module //,
        // replace: function(filename) {
        //   return filename.replace('.jade', '.html');
        // }
        //  stripPrefix: config.cwd
      }))
      // .pipe($.concat(config.module + '.js'))
      .pipe($.gulp.dest(config.dest))
      .pipe($.size({
        showFiles: true
      }));
  }
}