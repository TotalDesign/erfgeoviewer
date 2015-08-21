define(['backbone', 'backbone.marionette', 'communicator', 'leaflet', 'leaflet.draw'],
  function(Backbone, Marionette, Communicator, L, LeafletDraw) {

    return Marionette.Object.extend({

      map: null,
      mapController: null,

      initialize: function(o) {

        var self = this;
        Communicator.mediator.on("map:ready", function(map) {
          self.map = map;
          self.initDraw();
        }, this);
      },

      initDraw: function() {

        // Leaflet map
        var map = this.map;
        var drawnItems = new L.FeatureGroup();

        map.addLayer(drawnItems);

        var drawControl = new L.Control.Draw({
          draw: {
            rectangle: false,
            circle: false,
          },
          edit: {
            featureGroup: drawnItems
          }
        });
        map.addControl(drawControl);

        map.on('draw:created', function (e) {
          var type = e.layerType,
            layer = e.layer;

          if (type === 'marker') {
            // Do marker specific actions

          }
          drawnItems.addLayer(layer);
        });

      }
    })

});