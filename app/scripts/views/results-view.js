/**
 * CollectionView for displaying search results.
 */
define( ["backbone", 'backbone.marionette', "communicator", "materialize.cards", "jquery", "leaflet",
         "config", "tpl!template/results.html"],
  function(Backbone, Marionette, Communicator, Materialize, $, L,
           Config, ResultItemTemplate) {

    var map;
    var layerGroup;
    var style = {
      // See path.options in leaflet documentation
      preview: {
        "color": '#000',
        "stroke": true,
        "weight": 2,
        "dashArray": "4, 4",
        "fillOpacity": 0.4,
        "fill": true,
        "fillColor": "#fff"
      },
      hover: {
        "color": Config.colors.secondary,
        "stroke": true,
        "weight": 3,
        "dashArray": null,
        "fillOpacity": 0.6,
        "fill": true,
        "fillColor": "#fff"
      }
    };

    var ResultItemView = Marionette.ItemView.extend({

      feature: null,

      onDestroy: function() {
        if (this.marker) layerGroup.removeLayer(this.marker);
      },

      onShow: function() {
        var p = new L.latLng(
          this.model.get( 'latitude' ),
          this.model.get( 'longitude' )
        );
        var geojson = this.model.convertToGeoJSON();
        if (geojson) {
          this.feature = L.geoJson(geojson, { style: style.preview } );
          layerGroup.addLayer( this.feature );
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