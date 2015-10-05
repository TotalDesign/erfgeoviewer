define(['backbone', 'models/state', 'views/settings/abstract-settings', 'config', 'tpl!template/settings/color.html'],
  function(Backbone, State, ParentView, Config, SettingsTemplate) {

    return ParentView.extend({

      template: SettingsTemplate,

      initialize: function() {
        this.model = new Backbone.Model({
          primaryColor: State.getPlugin('map_settings').model.get('primaryColor'),
          secondaryColor: State.getPlugin('map_settings').model.get('secondaryColor'),
          availableColors: Config.availableColors
        });
      }

    });

  });