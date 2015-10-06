define(['backbone.marionette', 'leaflet', 'config', 'communicator', 'tpl!template/detail-navigation-item.html'],
  function(Marionette, L, Config, Communicator, Template) {

    return Marionette.ItemView.extend({

      template: Template,

      events: {
        'click': 'onClick'
      },

      className: function() {
        return 'feature-nav ' + this.model.get('nav');
      },

      serializeModel: function(model) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          label: model.get('nav') == 'previous' ? 'Previous' : 'Next'
        });
      },

      onClick: function(e) {
        e.stopPropagation();
        e.preventDefault();

        Communicator.mediator.trigger( "marker:click", this.model);
      }

    });

  });