define(['backbone', 'models/state', 'views/settings/abstract-settings', 'communicator', 'config', 'tpl!template/settings/map-style.html'],
  function(Backbone, State, ParentView, Communicator, Config, SettingsTemplate) {

    return ParentView.extend({

      events: _.extend({}, ParentView.prototype.events, {
        'click img': function(e) {
          Communicator.mediator.trigger('map:changeBase', $(e.target).data('id'));
        }
      }),

      template: SettingsTemplate,

      initialize: function() {
        this.model = new Backbone.Model({
          tiles: Config.tiles,
          allowStyleChange: State.getPlugin('map_settings').model.get('allowStyleChange')
        });
      }

    });

  });