define(["backbone.marionette",
  "tpl!modules/delving/templates/search-box.html"],
  function(Marionette, SearchTemplate) {

  return Marionette.ItemView.extend({

    model: null,
    template: SearchTemplate,
    events: {},

    initialize: function(o) {
      this.model = o.model;
      _.bindAll( this, 'search' );
    },

    onShow: function() {
      var self = this;
      $( '.search-box', this.$el ).keyup( function( e ) {
        if (e.keyCode == 13) {
          e.preventDefault();
          self.search(e);
        }
      });
    },

    search: function(e) {
      var $t = $( e.target );
      var term = $t.val();
      this.model.set( 'terms', term );
    }

  });

});