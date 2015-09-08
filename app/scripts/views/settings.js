/**
 * Slideout view "Add markers".
 */
define(['backbone.marionette', 'jquery', 'materialize.collapsible', 'tpl!template/settings.html',
  'views/settings/interface', 'views/settings/color', 'views/settings/map-style'],
  function( Marionette, $, Materialize, LayoutTemplate, InterfaceSettingsView, ColorSettingsView, MapStyleSettingsView ) {

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
        this.mapStyleSettings.show(new MapStyleSettingsView());

        $('.collapsible', this.$el).collapsible();
      }

    });

  }
);