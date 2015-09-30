define(['backbone', 'backbone.marionette', 'communicator', 'leaflet', 'leaflet.draw', 'models/marker', 'models/state'],
  function(Backbone, Marionette, Communicator, L, LeafletDraw, MarkerModel, State) {

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
        var self = this;

        // Temporary layer used for drawing.
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        var drawControl = new L.Control.Draw({
          draw: {
            rectangle: false,
            circle: false
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
            var spot = layer.getLatLng();
            var m = State.get('markers');
            m.add({
              title: 'Nieuwe POI',
              description: 'Mijn nieuwe marker.',
              longitude: [spot.lng],
              latitude: [spot.lat]
            });
          }
          else if (type == "polygon" || type == "polyline") {

            // TODO: this needs to change for erfgeoviewer
            var geo = State.get('features');
            geo.add({
              'title': 'Mijn route',
              'geojson': layer.toGeoJSON()
            });

          }

        });

      }
    })

  });