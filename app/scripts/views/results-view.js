/**
 * CollectionView for displaying search results.
 */
define( ["backbone", 'backbone.marionette', "communicator", "materialize.cards", "jquery", "leaflet",
         "tpl!template/results.html"],
  function(Backbone, Marionette, Communicator, Materialize, $, L,
           ResultItemTemplate) {

    var map;
    var layerGroup;

    var ResultItemView = Marionette.ItemView.extend({

      marker: null,

      onDestroy: function() {
        layerGroup.removeLayer(this.marker);
      },

      onShow: function() {
        var p = new L.latLng(
          this.model.get( 'latitude' ),
          this.model.get( 'longitude' )
        );
        var m = this.model.convertToGeoJSON();
        if (m) {
          this.marker = L.mapbox.featureLayer();
          this.marker.setGeoJSON( m );
          layerGroup.addLayer( this.marker );
        }
      },

      template: ResultItemTemplate

    });

    return Marionette.CollectionView.extend({

      initialize: function() {

        map = Communicator.reqres.request("getMap");
        layerGroup = L.layerGroup().addTo(map);

      },

      events: {
        "click .add-marker": function(e) {
          e.preventDefault();
          var modelId = $( e.target ).data( 'model-id' );
          Communicator.mediator.trigger( "marker:addModelId", modelId);
        }
      },

      childView: ResultItemView

    });

  }
);