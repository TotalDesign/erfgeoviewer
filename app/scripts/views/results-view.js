/**
 * CollectionView for displaying search results.
 */
define( ["backbone", 'backbone.marionette', "communicator", "materialize.cards", "jquery", "leaflet", "underscore",
         "config", "tpl!template/results.html"],
  function(Backbone, Marionette, Communicator, Materialize, $, L, _,
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
        "click .add-marker": function(e) {
          e.preventDefault();

          Communicator.mediator.trigger( "marker:addModelId", this.model.cid );
        },
        'click .zoomin': function(e) {
          e.preventDefault();
          map.fitBounds( this.feature.getBounds() );
          map.zoomOut();
        },
        'mouseover .card': function(e) {
          if (this.noGeo) return;
          this.feature.bringToFront();
          //map.panTo( this.feature.getBounds().getCenter() );
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
        if (geojson && geojson.geometry) {
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

      },

      childView: ResultItemView,

      onRender: function() {

        // If called immediately, results in error.
        _.delay(function() {
          map.fitBounds( layerGroup.getBounds() );
        }, 500);

      }


    });

  }
);