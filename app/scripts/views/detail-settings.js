define( ["backbone", "backbone.marionette", "communicator", "medium.editor", "jquery",
    "tpl!template/detail-settings.html"],
  function( Backbone, Marionette, Communicator, MediumEditor, $,
            Template ) {

    return Marionette.ItemView.extend( {

      template: Template,

      events: {
        'click .delete': function(e) {
          e.preventDefault();

          Communicator.mediator.trigger( "marker:removeModelByCid", this.model.cid);
        }
      },

      initialize: function( o ) {
        this.model = o.model;
      },

      onShow: function() {

      }

    } );

  } );