({
  baseUrl: './',
  mainConfigFile: 'index.js',
  name: 'index',
  out: '../../dist/index.js',
  removeCombined: true,
  wrapShim: true,
  paths: {
    jquery: "empty:",
    angular: "empty:",
    angularRoute: "empty:",
    angularUISlider: "../../bower_components/angular-ui-slider/src/slider",
    jqueryUI: "empty:",
    underscore: "empty:",
    bootstrap: "empty:"
  },
  uglify: {
    beautify: true
  }
})