'use strict';

// Dummy module for running uncompiled from static web server.
// Templates will be loaded through ajax

angular.module("app-templates", []).run(function() {
  console.warn("Templates will load through ajax");
});