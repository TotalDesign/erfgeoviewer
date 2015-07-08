define( ["backbone", "backbone.marionette", "communicator",
    "tpl!template/popup.html"],
  function( Backbone, Marionette, Communicator,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,
      dom: {},

      events: {
      },

      initialize: function( o ) {
        this.model = o.model;
        this.layout = o.layout;
      }

    } );

  } );