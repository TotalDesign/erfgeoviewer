define(["backbone", "backbone.marionette", "jquery", "communicator",
    "tpl!template/search/search-box.html"],
  function(Backbone, Marionette, $, Communicator,
           SearchFieldTemplate) {

  return Marionette.ItemView.extend({

    model: null,
    template: SearchFieldTemplate,
    toggleTexts: {
      1: 'Eenvoudig zoeken',
      0: 'Geavanceerd zoeken'
    },

    events: {
      'click .search-advanced-toggle': function(e) {
        e.preventDefault();
        var $t = $(e.target)
        this.currentText = (this.currentText) ? 0 : 1;
        $t.text(this.toggleTexts[this.currentText]);
        Communicator.mediator.trigger("search:toggleAdvancedSearch");
      }
    },

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