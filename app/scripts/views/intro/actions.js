define(['backbone', 'backbone.marionette', 'views/layout/intro.layout', 'tpl!template/intro/actions.html'],
  function( Backbone, Marionette, IntroLayout, Template ) {

    return Marionette.ItemView.extend({

      className: 'row',

      template: Template,

      events: {
        'click .btn-new': function(e) {
          e.preventDefault();
          e.stopPropagation();

          IntroLayout.closeModal();
        },
        'click .btn-open': function() {
          IntroLayout.closeModal();
        }
      }

    });

  });