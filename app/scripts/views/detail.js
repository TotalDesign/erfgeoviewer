define( ["backbone", "backbone.marionette", "communicator", "models/search-result",
    "tpl!template/detail.html"],
  function( Backbone, Marionette, Communicator, SearchResultModel,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,
      layout: null,
      dom: {},

      events: {
      },

      initialize: function( o ) {
        console.log( o.model );
        this.model = o.model;
      }

    } );

  } );