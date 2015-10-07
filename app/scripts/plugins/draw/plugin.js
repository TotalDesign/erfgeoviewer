define(['plugin/abstract', 'communicator', 'underscore', 'leaflet', 'leaflet.draw', 'models/state', 'erfgeoviewer.common'],
  function(Plugin, Communicator, _, L, LDraw, State, App) {

  return Plugin.extend({

    initialize: function() {
      Communicator.mediator.on("map:ready", this.initDrawPlugin, this);
    },

    initDrawPlugin: function(map) {

      if (App.mode == "reader") {
        console.log("Draw plugin is not intended for reader mode");
        return;
      }

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

      map.on('draw:created', _.bind(this.onFeatureCreated, this));
    },

    onFeatureCreated: function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        var spot = layer.getLatLng();
        State.getPlugin('geojson_features').collection.add({
          title: 'Nieuwe POI',
          description: 'Mijn nieuwe marker.',
          longitude: [spot.lng],
          latitude: [spot.lat]
        });
      }
//      @Todo: feature model should work ONLY with GeoJSON instead of GeoSPARQL and lat/long.
//      else if (type == "polygon" || type == "polyline") {
//        State.getPlugin('geojson_features').collection.add({
//          'title': 'Mijn route',
//          'spatial': layer.toGeoJSON()
//        });
//      }
    }
  });
});
