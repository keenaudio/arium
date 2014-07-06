console.log("merge JS");
if (typeof exports !== 'undefined') { 
  console.log("USING NODE EXTEND");
  module.exports = require('node.extend');
} else {
  console.log("USING jQuery extend");
  define(['jquery'], function($) {
    console.log("Returning jQuery extend");
    return function() {
      console.log("CALLING MY EXTEND");
      return $.extend.apply($, arguments);
    };
  });
}