define(["backbone.marionette"], function(Marionette) {

  return Marionette.Object.extend({

    // Module should define its own layout
    layoutView: Marionette.LayoutView,

    // Defines module
    module: {
      'type': ''
    },

    // Instantiated layout view
    layout: null,

    render: function() {
      console.log('Your module should override this.')
    },

    /**
     * Creates layout, renders module.
     */
    showModule: function(region) {

      this.container = region;
      this.layout = new LayoutView();
      this.layout.render();
      this.container.show( layout );
      this.render();

    }

  });

});