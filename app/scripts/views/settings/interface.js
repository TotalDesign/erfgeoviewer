define(["backbone", "backbone.marionette", "jquery", "tpl!template/settings/interface.html"],
  function(Backbone, Marionette, $, SettingsTemplate) {

    return Marionette.ItemView.extend({

      events: {
        'change input': 'change'
      },

      model: null,

      state: null,

      template: SettingsTemplate,

      initialize: function(o) {
        this.model = new Backbone.Model({
          showMapTitle: o.state.get( 'mapSettings' ).showMapTitle,
          showSearchFilter: o.state.get( 'mapSettings' ).showSearchFilter,
          allowFullscreen: o.state.get( 'mapSettings' ).allowFullscreen,
          showShare: o.state.get( 'mapSettings' ).showShare,
          showLegend: o.state.get( 'mapSettings' ).showLegend
        });

        this.state = o.state;
      },

      change: function(e) {
        var mapSettings = this.state.get( 'mapSettings' ),
          $input = $(e.currentTarget),
          override = {};

        override[$input.data('property')] = $input.is(":checked") ;

        mapSettings = _.extend( mapSettings, override );

        this.state.set( 'mapSettings', mapSettings );
        this.state.save();
      }

    });

  });