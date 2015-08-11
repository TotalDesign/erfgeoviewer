define(["backbone.marionette"], function(Marionette) {

  return Marionette.Object.extend({

    // Module must override this with a LayoutView
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
      this.layout = new this.layoutView();
      this.container.show( this.layout );
      this.render();

    }

  });

});