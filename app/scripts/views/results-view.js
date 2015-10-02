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
        "color": '#000',
        "stroke": true,
        "weight": 2,
        "dashArray": null,
        "fillOpacity": 0.8,
        "fill": true,
        "fillColor": Config.colors.primary
      }
    };

    var ResultItemView = Marionette.ItemView.extend({

      noGeo: true,

      events: {
        'mouseover .card': function(e) {
          if (this.noGeo) return;
          this.feature.bringToFront();
          this.styleFeature(style.hover);
          $('.card', this.$el).addClass('hovered');
        },
        'mouseout .card': function() {
          if (this.noGeo) return;
          this.styleFeature(style.preview);
          $('.card', this.$el).removeClass('hovered');
        }
      },

      feature: null,

      onDestroy: function() {

        // Remove from map.
        if (this.marker) layerGroup.removeLayer(this.marker);

      },

      onShow: function() {

        var self = this;

        // Show on map
        var p = new L.latLng(
          this.model.get( 'latitude' ),
          this.model.get( 'longitude' )
        );
        var geojson = this.model.convertToGeoJSON();
        if (geojson) {
          this.noGeo = false;
          this.feature = L.geoJson(geojson, { style: style.preview } );
          layerGroup.addLayer( this.feature );
          this.feature.addEventListener('mouseover', function() {
            self.$el.find('.card').addClass('hovered');
          });
          this.feature.addEventListener('mouseout', function() {
            self.$el.find('.card').removeClass('hovered');
          });
        }


      },

      styleFeature(options) {
        this.feature.setStyle(options);
      },

      template: ResultItemTemplate

    });

    return Marionette.CollectionView.extend({

      initialize: function() {

        map = Communicator.reqres.request("getMap");
        layerGroup = L.featureGroup().addTo(map);
        layerGroup.bringToFront();
        console.log('pagination');

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