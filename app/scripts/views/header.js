define(["backbone", "backbone.marionette", "communicator", "tpl!template/header.html"],
  function(Backbone, Marionette, Communicator, Template) {

  return Marionette.ItemView.extend({

    template: Template,

    events: {
      'click .zoom-in': function(e) {
        Communicator.mediator.trigger("MAP:ZOOM_IN_REQUESTED");
      },
      'click .zoom-out': function(e) {
        Communicator.mediator.trigger("MAP:ZOOM_OUT_REQUESTED");
      }
    },

    initialize: function() {
    }

  });

});