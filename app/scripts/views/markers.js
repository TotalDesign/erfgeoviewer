/**
 * Slideout view "Add markers".
 */
define(['backbone', 'backbone.marionette', 'communicator', 'velocity', 'materialize.tabs',
    'tpl!template/markers.html'],
  function( Backbone, Marionette, Communicator, Velocity, MaterializeTabs,
            LayoutTemplate ) {

    return Marionette.LayoutView.extend({

      template: LayoutTemplate,

      // A region for the content of each tab.
      // Tabs themselves are contained in the layout template.
      regions: {
        search: "#toolbar-search",
        library: "#toolbar-library"
      },

      initialize: function(o) {

        console.log('Initialized markers view.');
        var self = this;
        this.render();
        this.container = o.region;
        this.modules = o.modules;

      },

      onRender: function() {
        var self = this;

        _.each(this.modules, function(m) {
          if ( m.module.type == "search" ) {
            m.showModule( self.search );
          }
        });
      },

      onShow: function() {
        $('ul.tabs', this.$el).tabs();
        this.$el.parent().addClass( "visible" );
      },

      onBeforeDestroy: function() {
        this.$el.parent().removeClass( "visible" );
      }

    });

  }
);