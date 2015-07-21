/**
 * Singleton.
 */
define(['jed'], function(Jed) {

  'use strict';

  var instance = null;

  function Singleton( translations ) {
    var jeddy = new Jed( translations );
    return jeddy;
  }

  return function getInstance( translations ) {
    instance = instance || new Singleton( translations );
    return instance;
  }

});