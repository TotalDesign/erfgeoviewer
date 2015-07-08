define(['backbone', 'backbone.marionette', 'communicator', 'velocity', 'materialize.tabs',
    'tpl!template/layer-add.html'],
  function( Backbone, Marionette, Communicator, Velocity, MaterializeTabs,
            LayoutTemplate ) {

    return Marionette.LayoutView.extend({

      template: LayoutTemplate,

      regions: {
        tabs: "#toolbar-tabs",
        search: "#toolbar-search",
        library: "#toolbar-library"
      },

      initialize: function(o) {

        console.log('Initialized layers view.');
        this.container = o.region;
        this.modules = o.modules;
        _.each(this.modules, function(m) {
          console.log(m.module);
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