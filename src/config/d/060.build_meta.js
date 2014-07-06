//@if LOG
var _f = function(msg) { return "build_meta.js: " + msg; };
//@end

module.exports = function(config) {

  //@if DEV
  return;
  //@end

  // build_info.json
  console.log(_f("Looking for build_info.json file at path: " + config.get('paths.buildInfo'))); //@strip
  var buildInfo;
  try {
    buildInfo = require(config.get('paths.buildInfo'));
  } catch (e) {
    console.error(_f(e)); //@strip
  }
  if (buildInfo) {
    console.log("********** Server build information: " + JSON.stringify(buildInfo, null, 2)); // do not strip this line
    console.log("********** " + config.get('github.project_url') + "/commit/" + buildInfo.gitinfo["local.branch.current.SHA"]); // or this one
    config.merge({
      buildInfo: buildInfo
    });
  }



  // File rev manifest json

  var rmPath = config.get('paths.revManifest', false);
  if (rmPath) {
    console.log(_f("Looking for rev-manifest.json file at path: " + rmPath)); //@strip
    var revManifest;
    try {
      revManifest = require(config.get('paths.revManifest'));
    } catch (e) {
      console.error(_f(e)); //@strip
    }
    if (revManifest) {
      console.log(_f("Rev Manifest: " + JSON.stringify(revManifest, null, 2))); //@strip
      config.merge({
        revManifest: revManifest
      });
    }
  } else {
    console.eror(_f("No rev-manifest.json found. Content will be served unversioned")); //@strip
  }


}