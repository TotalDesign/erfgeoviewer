/**
 * Slideout view "Add markers".
 */
define(['backbone', 'backbone.marionette', 'communicator', 'velocity', 'materialize.tabs', 'jquery',
    'tpl!template/markers.html'],
  function( Backbone, Marionette, Communicator, Velocity, MaterializeTabs, $,
            LayoutTemplate ) {

    return Marionette.LayoutView.extend({

      template: LayoutTemplate,

      events: {
        'click .hide-flyout': function(e) {
          Communicator.mediator.trigger('flyouts:hideRegionById', $(e.target).closest('.region').attr('id'));
        }
      },

      // A region for the content of each tab.
      // Tabs themselves are contained in the layout template.
      regions: {
        search: "#toolbar-search",
        library: "#toolbar-library"
      },

      initialize: function(o) {

        console.log('Initialized Add Markers search view.');
        var self = this;
        this.container = o.region;
        this.searchModule = o.searchModule;
        this.render();

      },

      onRender: function() {
        this.searchModule.showModule( this.search );
      },

      onShow: function() {
        var self = this;
        $('ul.tabs', this.$el).tabs();
        this.$el.parent().addClass( "visible" );
      },

      onBeforeDestroy: function() {
        this.$el.parent().removeClass( "visible" );
      }

    });

  }
);