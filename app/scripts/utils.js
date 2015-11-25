define([
  'backbone'
],
function( Backbone ) {
  'use strict';

  var Utils = {
    getIEVersion: function() {
      //msie will be positive number if its IE and NaN for other browsers
      var msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
      if (isNaN(msie)) {
        msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
      }
      if ($.isNumeric(msie)) {
        return msie;
      }
      return 0;
    }
  }

  return Utils;
});
