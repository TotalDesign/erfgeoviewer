define(["backbone", "backbone.marionette", "jquery", "config", "tpl!template/settings/color.html"],
  function(Backbone, Marionette, $, Config, SettingsTemplate) {

    return Marionette.ItemView.extend({

      events: {
        'change select': 'change'
      },

      model: null,

      state: null,

      template: SettingsTemplate,

      initialize: function(o) {
        this.model = new Backbone.Model({
          primaryColor: o.state.get( 'mapSettings' ).primaryColor,
          secondaryColor: o.state.get( 'mapSettings' ).secondaryColor,
          availableColors: Config.availableColors
        });

        this.state = o.state;
      },

      change: function(e) {
        var mapSettings = this.state.get( 'mapSettings' ),
          $input = $(e.currentTarget),
          override = {};

        override[$input.data('property')] = $input.val();

        mapSettings = _.extend( mapSettings, override );

        this.state.set( 'mapSettings', mapSettings );
        this.state.save();
      }

    });

  });