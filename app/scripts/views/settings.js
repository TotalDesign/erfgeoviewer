/**
 * Slideout view "Add markers".
 */
define(['backbone.marionette', 'jquery', 'materialize.collapsible', 'tpl!template/settings.html',
  'views/settings/interface', 'views/settings/color', 'views/settings/map-style', 'views/settings/legend'],
  function( Marionette, $, Materialize, LayoutTemplate, InterfaceSettingsView, ColorSettingsView, MapStyleSettingsView, LegendSettingsView ) {

    return Marionette.LayoutView.extend({

      regions: {
        interfaceSettings: "#settings-interface",
        colorSettings: "#settings-color",
        mapStyleSettings: "#settings-map-style",
        legendSettings: "#settings-legend"
      },

      state: null,

      template: LayoutTemplate,

      initialize: function(o) {
        this.state = o.state;

        this.render();
      },

      onShow: function() {
        this.interfaceSettings.show(new InterfaceSettingsView({
          state: this.state
        }));
        this.colorSettings.show(new ColorSettingsView({
          state: this.state
        }));
        this.mapStyleSettings.show(new MapStyleSettingsView({
          state: this.state
        }));
        this.legendSettings.show(new LegendSettingsView({
          state: this.state
        }));

        $('.collapsible', this.$el).collapsible();
      }

    });

  }
);