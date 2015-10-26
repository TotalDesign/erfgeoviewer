define(['backbone', 'models/state', 'views/settings/abstract-settings', 'tpl!template/settings/interface.html'],
  function(Backbone, State, ParentView, SettingsTemplate) {

    return ParentView.extend({

      template: SettingsTemplate,

      initialize: function() {
        this.model = new Backbone.Model({
          showMapTitle: State.getPlugin('map_settings').model.get('showMapTitle'),
          showSearchFilter: State.getPlugin('map_settings').model.get('showSearchFilter'),
          showShare: State.getPlugin('map_settings').model.get('showShare'),
          showLegend: State.getPlugin('map_settings').model.get('showLegend'),
          showList: State.getPlugin('map_settings').model.get('showList')
        });
      }

    });

  });