/**
 * CollectionView for displaying search results.
 */
define( ["backbone", 'backbone.marionette', "communicator", "materialize.cards",
         "jquery", "leaflet", "underscore", "config", 'erfgeoviewer.common', "tpl!template/result-item.html", "tpl!template/results.html"],
  function(Backbone, Marionette, Communicator, Materialize, $, L, _,
           Config, App, ResultItemTemplate, ResultsTemplate) {

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

      addDisabled: false,
      feature: null,
      noGeo: true,
      events: {
        "click .add-marker": function(e) {
          e.preventDefault();
          if (this.addDisabled) return;
          Communicator.mediator.trigger( "marker:addModelId", this.model.cid );
          map.panTo( this.feature.getBounds().getCenter() );
          this.removeMarker();
          this.disableAdd();
        },
        'click .open-detail': function(e) {
          e.preventDefault();
          Communicator.mediator.trigger("marker:click", this.model);
        },
        'click .zoomin': function(e) {
          e.preventDefault();
          if (this.noGeo || !this.feature) return;
          map.fitBounds( this.feature.getBounds() );
          map.zoomOut();
        },
        'mouseover .card': function(e) {
          if (this.noGeo || !this.feature) return;
          this.feature.bringToFront();
          //map.panTo( this.feature.getBounds().getCenter() );
          this.styleFeature(style.hover);
          $('.card', this.$el).addClass('hovered');
        },
        'mouseout .card': function() {
          if (this.noGeo || !this.feature) return;
          this.styleFeature(style.preview);
          $('.card', this.$el).removeClass('hovered');
        }
      },

      disableAdd: function() {
        this.addDisabled = true;
        $('.card', this.$el).addClass('already-added');
      },

      onDestroy: function() {
        this.removeMarker();
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
        } else {
          this.noGeo = true;
          this.disableAdd();
        }


      },

      removeMarker: function() {
        if (this.feature) {
          layerGroup.removeLayer(this.feature);
          this.feature = false;
        }
      },

      serializeModel: function(model) {
        return _.extend(model.toJSON.apply(model, _.rest(arguments)), {
          mode: App.mode
        });
      },

      styleFeature(options) {
        this.feature.setStyle(options);
      },

      template: ResultItemTemplate

    });

    return Marionette.CompositeView.extend({

      childView: ResultItemView,

      childViewContainer: "#search-results",

      template: ResultsTemplate,

      initialize: function() {

        var self = this;
        map = Communicator.reqres.request("getMap");
        layerGroup = L.featureGroup().addTo(map);
        layerGroup.bringToFront();

        Communicator.mediator.on( "search:destroyed", function() {
          layerGroup.clearLayers();
        });

        this.collection.on('reset', this.render, this );
      },

      onBeforeRender: function() {
        if (this.model) {
          this.model.destroy();
          this.model = null;
        }

        var total = this.collection.state.totalRecords || 0,
          end = this.collection.state.currentPage * this.collection.state.pageSize;

        if (end > total) {
          end = total;
        }

        this.model = new Backbone.Model({
          start: (this.collection.state.currentPage -1) * this.collection.state.pageSize +1,
          end: end,
          total: total
        });
      },

      onRender: function() {

        // If called immediately, results in error.
        _.delay(function() {
          var bounds = layerGroup.getBounds();
          if (bounds.isValid()) map.fitBounds( bounds, { padding: [10, 10] } );
        }, 500);

      },

      onDestroy: function() {
        Communicator.mediator.off( "search:destroyed", null, this );
      }


    });

  }
);