define( ["backbone", "backbone.marionette",
    "tpl!template/header.html"],
  function( Backbone, Marionette,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,
      dom: {},

      events: {
      },

      initialize: function( o ) {
      }

    } );

  } );