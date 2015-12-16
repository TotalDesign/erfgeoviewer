define(['backbone', 'backbone.marionette', 'communicator', 'tpl!template/intro/actions.html'],
  function( Backbone, Marionette, Communicator, Template ) {

    return Marionette.ItemView.extend({

      className: 'row',

      template: Template,

      events: {
        'click .btn-new': function(e) {
          e.preventDefault();
          e.stopPropagation();

          Communicator.mediator.trigger("introduction:close")
        },
        'click .btn-open': function() {
          Communicator.mediator.trigger("introduction:close")
        }
      }

    });

  });