define(['backbone', 'backbone.marionette', 'communicator', 'leaflet', 'leaflet.draw'],
  function(Backbone, Marionette, Communicator, L, LeafletDraw) {

    return Marionette.Object.extend({
      initialize: function() {

        var map = Communicator.reqres.request('getMap');
        var drawnItems = new L.FeatureGroup();

        console.log(map);
        map.addLayer(drawnItems);

        var drawControl = new L.Control.Draw({
          edit: {
            featureGroup: drawnItems
          }
        });
        map.addControl(drawControl);

      }
    })

});