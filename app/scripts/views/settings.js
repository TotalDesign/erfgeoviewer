/**
 * Slideout view "Add markers".
 */
define(['backbone.marionette', 'jquery', 'materialize.collapsible', 'tpl!template/settings.html',
  'views/settings/interface', 'views/settings/color', 'views/settings/map-style', 'views/settings/legend'],
  function( Marionette, $, Materialize, LayoutTemplate,
            InterfaceSettingsView, ColorSettingsView, MapStyleSettingsView, LegendSettingsView ) {

    return Marionette.LayoutView.extend({

      regions: {
        interfaceSettings: "#settings-interface",
        colorSettings: "#settings-color",
        mapStyleSettings: "#settings-map-style",
        legendSettings: "#settings-legend"
      },

      template: LayoutTemplate,

      initialize: function(o) {
        this.render();
      },

      onShow: function() {
        this.interfaceSettings.show(new InterfaceSettingsView());
        this.colorSettings.show(new ColorSettingsView());
        this.mapStyleSettings.show(new MapStyleSettingsView());
        this.legendSettings.show(new LegendSettingsView());

        $('.collapsible', this.$el).collapsible();
      }

    });

  }
);