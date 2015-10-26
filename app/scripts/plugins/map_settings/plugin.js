define(['plugin/abstract', './models/settings', 'underscore', 'jquery', 'models/navbar',
        'tpl!./templates/styles.css', 'erfgeoviewer.common'],
  function(Plugin, SettingsModel, _, $, NavBar, CssTemplate, App) {

    return Plugin.extend({

      $styles: null,

      model: null,

      template: CssTemplate,

      initialize: function(options) {
        this.model = new SettingsModel();

        this.model.on('change', this.save, this);

        this.model.on('change:primaryColor change:secondaryColor', this.updateColor, this);

        options.state.set('map_settings', this.model);

        if (App.mode == 'mapmaker') {
          NavBar.addItem('settings', {
            fragment: 'settings',
            label: 'Instellingen',
            weight: 800
          });
        }
      },

      reset: function() {
        this.model.set(this.model.defaults);
      },

      readData: function(resp) {
        // If there is data, then populate the collection
        if (!_.isUndefined(resp)) {
          this.model.set(resp, { saveState: false });
        }
        return this.model;
      },

      writeData: function () {
        return this.model.toJSON({ emulateHTTP: true });
      },

      updateColor: function() {
        var rules;

        // Create HTML element if it doesn't exist
        if (!this.$styles) {
          this.$styles = $("<style>")
            .prop("type", "text/css")
            .appendTo("head");
        }

        this.$styles.html(this.template(this.serializeModel(this.model)));
      },

      serializeModel: function(model) {
        var attrs = model.toJSON();

        attrs.primaryColorDecimal = this.hexToRgb(attrs.primaryColor).join(', ');
        attrs.primaryColorDarken20 = this.colorLuminance(attrs.primaryColor, -0.20);
        attrs.primaryColorDarken40 = this.colorLuminance(attrs.primaryColor, -0.40);
        attrs.secondaryColorDecimal = this.hexToRgb(attrs.secondaryColor).join(', ');

        return attrs;
      },

      hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : null;
      },

      colorLuminance: function(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
          hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
          c = parseInt(hex.substr(i*2,2), 16);
          c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
          rgb += ("00"+c).substr(c.length);
        }

        return rgb;
      }
    });

  });
