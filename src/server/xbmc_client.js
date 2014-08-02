'use strict';

var xbmc = require('xbmc');
var TCPConnection = xbmc.TCPConnection;
var XbmcApi = xbmc.XbmcApi;

module.exports = function(config) {

  var xbmcConf = config.get('xbmc');
  console.log("XMBC config: " + JSON.stringify(xbmcConf, null, 2));
  var connection = new TCPConnection(xbmcConf);

  var xbmcApi = new XbmcApi;

  xbmcApi.setConnection(connection);

  xbmcApi.on('connection:data', function() {
    return console.log('onData');
  });

  xbmcApi.on('connection:open', function() {

    console.log('onOpen');
    xbmcApi.send("VideoLibrary.GetMusicVideos").then(function(lib) {
      console.log("OK, here's the library: " + JSON.stringify(lib, null, 2));
    });
    //  xbmcApi.send('JSONRPC.Introspect');


  });

  xbmcApi.on('connection:close', function() {
    return console.log('onClose');
  });

  xbmcApi.on('connection:error', function() {
    return console.log('onError');
  });

  xbmcApi.on('api:movie', function(details) {
    return console.log('onMovie', details);
  });

  xbmcApi.on('api:episode', function(details) {
    return console.log('onEpisode', details);
  });

  xbmcApi.on('api:playerStopped', function() {
    return console.log('onPlayerStopped');
  });

  xbmcApi.on('api:video', function() {
    return console.log('onVideo');
  });

  xbmcApi.on('notification:play', function(data) {
    return console.log('onPlay: ' + JSON.stringify(data, null, 2));
  });

  xbmcApi.on('notification:pause', function() {
    return console.log('onPause');
  });

  xbmcApi.on('notification:add', function() {
    return console.log('onPause');
  });

  xbmcApi.on('notification:update', function() {
    return console.log('onPause');
  });

  xbmcApi.on('notification:clear', function() {
    return console.log('onPause');
  });

  xbmcApi.on('notification:scanstarted', function() {
    return console.log('onPause');
  });

  xbmcApi.on('notification:scanfinished', function() {
    return console.log('onPause');
  });

  xbmcApi.on('notification:screensaveractivated', function() {
    return console.log('onPause');
  });

  xbmcApi.on('notification:screensaverdeactivated', function() {
    return console.log('onPause');
  });

  console.log('done');

  // xbmcApi.send('JSONRPC.Introspect');

};