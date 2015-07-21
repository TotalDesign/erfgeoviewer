define(["backbone.marionette", "react", "simplepaginator"], function(Marionette, React, SimplePaginator) {

  return Marionette.ItemView.extend({

    initialize: function( o ) {

      console.log('paginator view initialized');
      this.model = o.model;

    }

  });

});