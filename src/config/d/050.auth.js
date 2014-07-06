
module.exports = function(config) {

  var secureCookies = true;
  
  //@if DEV
  secureCookies = false;
  //@end
  
  // Passport auth
  config.merge({
    "passport": {
      "secure": secureCookies,
      "proxy": true
    }
  });

}