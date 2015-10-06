/**
 * Flyout view "Zoeken". A search module is loaded inside of here.
 */
define(['../../../bower_components/backbone/backbone', 'backbone.marionette', 'communicator', 'jquery',
    'tpl!template/search/layout-flyout.html'],
  function( Backbone, Marionette, Communicator, $,
            LayoutTemplate ) {

    return Marionette.LayoutView.extend({

      template: LayoutTemplate,

      events: {
        'click .hide-flyout': function(e) {
          Communicator.mediator.trigger('flyouts:hideRegionById', $(e.target).closest('.region').attr('id'));
        }
      },

      regions: {
        search: "#search-region"
      },

      initialize: function(o) {

        this.container = o.region;
        this.searchModule = o.searchModule;
        this.render();

        Communicator.mediator.on("search:toggleAdvancedSearch", this.toggleAdvancedSearch, this);

      },

      onRender: function() {
        this.searchModule.showModule( this.search );
      },

      onShow: function() {
        this.$el.parent().addClass( "visible" );
        this.$el.parent().addClass( "search-normal" );
      },

      onBeforeDestroy: function() {
        this.$el.parent().removeClass( "visible search-normal search-advanced" );
        Communicator.mediator.off("search:toggleAdvancedSearch", this.toggleAdvancedSearch, this);
      },

      toggleAdvancedSearch: function() {
        this.$el.parent().toggleClass( "search-normal" );
        this.$el.parent().toggleClass( "search-advanced" );
      }

    });

  }
);