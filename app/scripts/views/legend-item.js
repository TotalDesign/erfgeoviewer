define(['backbone.marionette', 'leaflet', 'config', 'tpl!template/legend-item.html'],
  function(Marionette, L, Config, Template) {

    return Marionette.ItemView.extend({

      template: Template,

      icon: null,

      initialize: function() {
        this.icon = L.mapbox.marker.icon({
          "marker-size": "small",
          "marker-color": this.model.get('color'),
          "marker-symbol": this.model.get('icon')
        }, {
          "accessToken": Config.mapbox.accessToken
        });
      },

      serializeModel: function(model) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          icon: this.icon._getIconUrl('icon')
        });
      }

    });

  });