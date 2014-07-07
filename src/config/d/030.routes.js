module.exports = function(config) {
  config.merge({
    routes: {
      "app": "",
      "json_api": "/json",
      "folders": "/folders",
      "als": "/als",
      "daw": "/daw",
      "static": "/static",
      "lib": "/lib"
    }
  });
}