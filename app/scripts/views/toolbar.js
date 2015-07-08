define(['backbone', 'backbone.marionette', 'communicator', 'velocity', 'materialize.tabs',
    'tpl!template/toolbar.html'],
  function( Backbone, Marionette, Communicator, Velocity, MaterializeTabs, LayoutTemplate ) {

    return Marionette.LayoutView.extend({
      template: LayoutTemplate,

      regions: {
        tabs: "#toolbar-tabs",
        features: "#toolbar-features",
        layers: "#toolbar-layers",
        base: "#toolbar-base"
      },

      initialize: function(o) {

        console.log('initialized toolbar view');
        this.container = o.region;
        this.modules = o.modules;
        _.each(this.modules, function(m) {
          console.log(m.module);
        });

      },

      onShow: function() {
        $('ul.tabs', this.$el).tabs();
      }

    });

  }
);