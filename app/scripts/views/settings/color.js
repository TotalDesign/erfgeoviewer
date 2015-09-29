define(['backbone', 'views/settings/abstract-settings', 'config', 'tpl!template/settings/color.html'],
  function(Backbone, ParentView, Config, SettingsTemplate) {

    return ParentView.extend({

      model: null,

      template: SettingsTemplate,

      initialize: function(o) {
        this.model = new Backbone.Model({
          primaryColor: o.state.get( 'mapSettings' ).primaryColor,
          secondaryColor: o.state.get( 'mapSettings' ).secondaryColor,
          availableColors: Config.availableColors
        });

        ParentView.prototype.initialize.apply(this, arguments);
      }

    });

  });