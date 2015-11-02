define(['underscore', 'backbone', 'models/state', 'views/settings/abstract-settings', 'tpl!template/settings/interface.html'],
  function(_, Backbone, State, ParentView, SettingsTemplate) {

    return ParentView.extend({

      template: SettingsTemplate,

      events: _.extend(
        ParentView.prototype.events, {
        'change #show-map-title': 'changeShowMapTitle'
      }),

      initialize: function() {
        this.model = new Backbone.Model({
          showMapTitle: State.getPlugin('map_settings').model.get('showMapTitle'),
          title: State.getPlugin('map_settings').model.get('title'),
          showSearchFilter: State.getPlugin('map_settings').model.get('showSearchFilter'),
          showShare: State.getPlugin('map_settings').model.get('showShare'),
          showLegend: State.getPlugin('map_settings').model.get('showLegend'),
          showList: State.getPlugin('map_settings').model.get('showList')
        });
      },

      changeShowMapTitle: function(e) {
        var $input = $(e.currentTarget);
        $("#map-title").prop('disabled', !$input.is(':checked'));
      }

    });

  });