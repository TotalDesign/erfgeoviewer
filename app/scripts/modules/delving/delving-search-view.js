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

      this.model.on( 'change:numfound', this.render );
    },

    onRender: function() {
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
      if (this.model.get('terms') == term) {
        // hack to force a change event
        term = term + ' ';
      }
      this.model.set( 'terms', term );
    }

  });

});