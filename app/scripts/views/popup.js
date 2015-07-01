define( ["backbone", "backbone.marionette", "communicator", "views/tooltip",
    "tpl!template/popup.html"],
  function( Backbone, Marionette, Communicator, TooltipView,
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