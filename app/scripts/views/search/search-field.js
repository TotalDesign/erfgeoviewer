define(["backbone", "backbone.marionette", "jquery", "communicator",
    "tpl!template/search/search-box.html"],
  function(Backbone, Marionette, $, Communicator,
           SearchFieldTemplate) {

  return Marionette.ItemView.extend({

    model: null,
    template: SearchFieldTemplate,
    toggleTexts: {
      1: 'Filters verbergen',
      0: 'Toon filters'
    },

    events: {
      'click .search-advanced-toggle': function(e) {
        e.preventDefault();
        var $t = $(e.target);
        this.currentText = (this.currentText) ? 0 : 1;
        $t.text(this.toggleTexts[this.currentText]);
        Communicator.mediator.trigger("search:toggleAdvancedSearch");
      },
      'click #search-button': function(e) {
        this.search({ target: $( '.search-box', this.$el)[0] });
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
      console.log(e);
      var $t = $( e.target );
      var term = $t.val();

      //set default wildcard search if nothing is supplied
      if (term == undefined || $.trim(term).length == 0) {
        term = '*';
      }

      this.model.set( 'terms', term, { silent: true } );
      this.model.trigger( 'change:terms' );
    }

  });

});