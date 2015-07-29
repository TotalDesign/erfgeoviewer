define(["backbone", "backbone.marionette", "jquery", "tpl!template/search-box.html"],
  function(Backbone, Marionette, $, SearchTemplate) {

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
      var $search = $( '.search-box', this.$el );
      $search.keyup( function( e ) {
        if (e.keyCode == 13) {
          e.preventDefault();
          self.search(e);
        }
      });
      _.delay(function() {
        $search.focus();
        var t = $search.val();
        $search.val('');
        $search.val(t);
      }, 100 );
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