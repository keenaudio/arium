
module.exports = function(config) {

  var authSetting = false; // enable auth, default setting
  
  //@if DEV
  authSetting = false; // no auth requirement on dev sites
  //@end
 
  // Default config
  config.merge({
    server: {
      auth: authSetting // set to true to enforce auth requirements
    }
  });
}