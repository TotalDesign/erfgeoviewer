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
      var self = this,
        $search = $( '.search-box', this.$el),
        $viewportFilter = $( '#filter-viewport', this.$el );

      $viewportFilter.change( function( e ) {
        e.preventDefault();
        console.log('checked: ' + $viewportFilter.is(':checked'));
        self.model.set( 'viewportFilter', $viewportFilter.is(':checked') );
      });

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

      this.model.set( 'terms', term, { silent: true } );
      this.model.trigger( 'change:terms' );
    }

  });

});