define(['backbone.marionette', 'leaflet', 'config', 'communicator', 'tpl!template/detail-navigation-item.html'],
  function(Marionette, L, Config, Communicator, Template) {

    return Marionette.ItemView.extend({

      template: Template,

      events: {
        'click': 'onClick'
      },

      className: function() {
        if (this.model.get('nav') == 'previous') {
          return 'feature-nav previous col s6';
        }
        else {
          return 'feature-nav next col s6' + ( this.model.get('firstItem') ? ' offset-s6' : '' );
        }
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