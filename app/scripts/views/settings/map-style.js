define(['views/settings/abstract-settings', 'communicator', 'config', 'tpl!template/settings/map-style.html'],
  function(ParentView, Communicator, Config, SettingsTemplate) {

    return ParentView.extend({

      events: _.extend({}, ParentView.prototype.events, {
        'click img': function(e) {
          Communicator.mediator.trigger('map:changeBase', $(e.target).data('id'));
        }
      }),

      model: null,

      template: SettingsTemplate,

      initialize: function(o) {
        this.model = new Backbone.Model({
          tiles: Config.tiles,
          allowStyleChange: o.state.get( 'mapSettings' ).allowStyleChange
        });

        ParentView.prototype.initialize.apply(this, arguments);
      }

    });

  });