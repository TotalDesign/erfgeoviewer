define(['backbone', 'views/settings/abstract-settings', 'tpl!template/settings/interface.html'],
  function(Backbone, ParentView, SettingsTemplate) {

    return ParentView.extend({

      model: null,

      template: SettingsTemplate,

      initialize: function(o) {
        this.model = new Backbone.Model({
          showMapTitle: o.state.get( 'mapSettings' ).showMapTitle,
          showSearchFilter: o.state.get( 'mapSettings' ).showSearchFilter,
          allowFullscreen: o.state.get( 'mapSettings' ).allowFullscreen,
          showShare: o.state.get( 'mapSettings' ).showShare,
          showLegend: o.state.get( 'mapSettings' ).showLegend
        });

        ParentView.prototype.initialize.apply(this, arguments);
      }

    });

  });