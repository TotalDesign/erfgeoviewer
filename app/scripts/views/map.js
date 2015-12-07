/**
 * Map control, shared between mapmaker and reader modes.
 * Functionality specific to mapmaker or reader should be placed in separte plugins.
 */
define(["backbone", "backbone.marionette", "leaflet", "d3", "communicator",
        "config", "jquery", "underscore", "erfgeoviewer.common",
        "leaflet.markercluster", "leaflet.smoothmarkerbouncing", "leaflet.proj",
        "leaflet.fullscreen", "leaflet-toolbar", "leaflet.distortableimage", 'models/state',
        "tpl!template/map.html", "vendor/sparql-geojson"],
  function(Backbone, Marionette, L, d3, Communicator, Config, $, _, App,
           LeafletMarkerCluster, LeafletBouncing, LeafletProjections,
           LeafletFullscreen, LeafletToolbar, LeafletDistortableImage, State, Template) {

  return Marionette.ItemView.extend({

    // Marionette properties.
    events: {},
    template: Template,

    // ID of dom element where Leaflet will be rendered.
    mapboxContainer: "map",

    // Map models to geometry by cid
    geometryMap: [],

    layers: {},

    currentImageLayer: null,

    controlLayer: null,

    // Marionette layout instance.
    layout: null,

    // Instance of a PopupView.
    popup: null,

    updateOnPositionChange: true,

    initialize: function(o) {

      var self = this;
      _.bindAll(this, 'updateMapSize', 'addFeature', 'addMarker', 'addImage', 'attachMoveEndListener');

      this.layout = o.layout;

      $( window ).resize( _.throttle( this.updateMapSize, 150 ) );

      // this.registerAutoWidthMarker();
      this.registerLeafletZoomThrottle(200);

      /**
       * Event listeners
       */
      Communicator.mediator.on( 'map:fitAll', function(bounds) {
        bounds = bounds || new L.LatLngBounds();

        _.each(self.layers, function(layers) {
          _.each(layers.getLayers(), function(layer) {
            if (layer instanceof L.Marker) {
              bounds.extend(layer.getLatLng());
            } else if (layer.getBounds) {
              var validBounds = layer.getBounds();
              if (validBounds.isValid()) {
                bounds.extend(validBounds);
              }
            } else if (layer.getCorners) {
              bounds.extend(layer.getCorners());
            }
          });
        });

        if (bounds.isValid()) {
          var paddingRight = 0;
          var flyoutRight = App.flyouts.getRegion('right').$container;
          if (flyoutRight) {
            paddingRight = flyoutRight.width() / 2;   //div 2 because the flyout overlaps the map with 50% of its width
          }
          var paddingLeft = 175;                      //see main.scss body#map.flyout-right-visible
          self.map.fitBounds(bounds, { paddingTopLeft: [paddingLeft, 10], paddingBottomRight: [paddingRight, 10] });
        } else {
          console.warn("map.js map:fitAll no valid bounds found!");
        }
      });
      Communicator.mediator.on('map:setPosition', function(options) {
        self.map.setView(options.centerPoint, options.zoom);
      });
      Communicator.mediator.on('map:resetEditorPosition', function() {
        if (State.getPlugin('map_settings').model.get('editorCenterPoint')) {
          self.map.setView(State.getPlugin('map_settings').model.get('editorCenterPoint'), State.getPlugin('map_settings').model.get('editorZoom'));
        }
      });
      Communicator.mediator.on('map:setUpdateOnPositionChange', function(value) {
        self.updateOnPositionChange = value;
      });
      Communicator.mediator.on( 'map:moveend', function(map) {
        if (self.updateOnPositionChange) {
          State.getPlugin('map_settings').model.set({
            editorCenterPoint: map.getCenter(),
            editorZoom: map.getZoom()
          });

//          self.state.save();
        }
      });
      Communicator.mediator.on( 'map:move', function() {
        self.map.fireEvent('moveend');
      });
      Communicator.mediator.on("map:panTo", function(o) {
        var latlng = L.latLng( [o.lat, o.lng] );
        self.map.panTo(latlng);
      });
      Communicator.mediator.on("map:zoomTo", function(zoom) {
        self.map.setZoom(zoom);
      });
      Communicator.mediator.on("map:zoomIn", function() {
        this.map.setZoom(this.map.getZoom() + 1);
      }, this);
      Communicator.mediator.on("map:zoomOut", function() {
        this.map.setZoom(this.map.getZoom() - 1);
      }, this);
      Communicator.mediator.on("map:updateSize", function() {
        _.throttle( self.updateMapSize, 150 )
      });
      Communicator.reqres.setHandler( "getMap", function() { return self.map; });

      Communicator.reqres.setHandler( "getMapLayerByCid", function(cid) {
        var geometryEntry = _.findWhere(self.geometryMap, { cid: cid });
        if (_.isObject(geometryEntry)) {
          return geometryEntry.layer;
        }
      });

      Communicator.reqres.setHandler( "getImageLayerEditModeByCid", function(cid) {
        var geometryEntry = _.findWhere(self.geometryMap, { cid: cid });
        if (_.isObject(geometryEntry) && geometryEntry.type === "image") {
          var imageLayer = geometryEntry.layer;
          //because the toolbar isn't working we're using an internal field here,
          //this could break in a future release of the DistortableImageOverlay plug-in
          return imageLayer.editing._mode;
        }
      });

      Communicator.mediator.on("image:setOpacity", function(o) {
        self.setOpacity(o.m, o.value);
      });

      Communicator.mediator.on("image:setEditMode", function(o) {
        self.setEditMode(o.m, o.value);
      });

      /**
       * State management.
       */
      State.getPlugin('geojson_features').collection.on('add', this.addFeature, this);

      State.getPlugin('geojson_features').collection.on('remove', this.removeMarker, this);

      State.getPlugin('geojson_features').collection.on('reset', this.initFeatures, this);

      State.getPlugin('map_settings').model.on('change:primaryColor', this.updatePrimaryColor, this);

      State.getPlugin('map_settings').model.on('change:baseMap', this.setBaseMap, this);

      Communicator.mediator.on('map:ready', function() {
        this.initFeatures(State.getPlugin('geojson_features').collection);
      }, this);

      this.initMap = _.bind(this._initMap, this);

      State.on('change:mapSettings', this.initMap)
    },

    initFeatures: function(collection) {
      var self = this;

      // Clear map
      _.each(_.keys(self.layers), function(group) {
        self.layers[group].clearLayers();
      });

      //clear internal lists
      this.geometryMap.splice(0, this.geometryMap.length);
      this.layers = {};

      //ensure we have an image layer group (needed for the layer control below)
      if ( _.isUndefined(self.layers["images"]) ) {
        var layerGroup = L.layerGroup().addTo(this.map);
        self.layers["images"] = layerGroup;
      }

      // Iterate over models
      collection.each(function(featureModel) {
        if (!featureModel.get('spatial') && (!featureModel.get('latitude') || !featureModel.get('longitude'))) return false;

        self.addFeature(featureModel);
      });

      //add or replace image overlay layer toggle control
      if (this.controlLayer) {
        this.controlLayer.removeFrom(this.map);
      }
      this.controlLayer = L.control.layers([], { "Oude kaartenlaag" : self.layers.images });
      this.controlLayer.addTo(this.map);
      this.updateLayerControl();
    },

    _initMap: function() {
      State.off('change:map_settings', this.initMap);

      this.map.setView( State.getPlugin('map_settings').model.get('editorCenterPoint') || [52.121580, 5.6304], State.getPlugin('map_settings').model.get('editorZoom') || 8 );
    },

    getGeoJSON: function(marker) {
      var spatial,
        geojson;

      if (spatial = marker.get( 'spatial' )) {
        switch (marker.get( 'geometryType' )) {
          case 'POINT':
            defaultProperties = {
              title: marker.get('title'),
              'marker-color': marker.get('color')
            };
            if (marker.get('icon')) defaultProperties['marker-symbol'] = marker.get('icon');
            break;

          default:
            defaultProperties = {
              title: marker.get('title'),
              fill: marker.get('color'),
              stroke: marker.get('color'),
              'marker-color': marker.get('color'),
              'marker-symbol': marker.get('icon')
            };
            break;
        }

        geojson = _.extend(sparqlToGeoJSON(marker.get( 'spatial' )[0]), { properties: defaultProperties });
      }
      else {
        geojson = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [marker.get( 'longitude' )[0], marker.get( 'latitude' )[0]]
          },
          properties: {
            title: marker.get('title')
          }
        };
        if (marker.get('color')) geojson.properties['marker-color'] = marker.get('color');
        if (marker.get('icon')) geojson.properties['marker-symbol'] = marker.get('icon');
      }

      return geojson;
    },

    addFeature: function(featureModel) {
      var type = featureModel.get("type");
      if (type === "marker") {
        this.addMarker(featureModel);
      } else if (type === "image") {
        this.addImage(featureModel);
      }
    },

    /**
     * Take model of marker and add to map.
     * @param m - model
     */
    addMarker: function(markerModel) {
      var self = this,
        markerModels = (_.isArray(markerModel)) ? markerModel : [markerModel],
        geojson,
        spatial;

      _.each(markerModels, function(m) {
        m.on('change', self.updateMarker, self);

        if (_.isEmpty(m.get( 'spatial' )) && (!m.get( 'latitude' ) || !m.get( 'longitude' ))) {
          console.log('invalid marker model:', m);
          return false;
        }
        geojson = m.convertToGeoJSON();

        var marker = L.mapbox.featureLayer();
        marker.setGeoJSON(geojson);
        marker.on("click", function() {
          if (self.currentImageLayer) {
            self.currentImageLayer.editing.disable();
            self.currentImageLayer = null;
          }
          Communicator.mediator.trigger("marker:click", m)
        });
        self.addMarkerGroup(marker, m.get('layerGroup'));

        self.geometryMap.push({
          cid: m.cid,
          layer: marker,
          type: "marker"
        });
      });
    },

    /**
     * Take model of image and add to map.
     * @param m - model
     */
    addImage: function(imageModel) {
      var self = this,
        imageModels = (_.isArray(imageModel)) ? imageModel : [imageModel],
        geojson,
        spatial;

      _.each(imageModels, function(m) {
        if (_.isEmpty(m.get( 'spatial' )) && (!m.get( 'latitude' ) || !m.get( 'longitude' ))) {
          console.log('invalid feature model:', m);
          return false;
        }
        geojson = m.convertToGeoJSON();

        var marker = null;
        var type = m.get("type");
        if (type === "image") {
          var imageUrl = m.get("image");
          if (geojson.geometry.type === "MultiPolygon") {
            var imageLayer;
            var opacity = m.get("opacity") || 1.0;
            var corners = m.get("corners");
            if (!corners) {
              var multipolygon = L.geoJson(geojson);
              var multipolygonBounds = multipolygon.getBounds();
              corners = [
                multipolygonBounds.getNorthWest(),
                multipolygonBounds.getNorthEast(),
                multipolygonBounds.getSouthWest(),
                multipolygonBounds.getSouthEast() ];
              m.set("corners", corners);
            }

            imageLayer = new L.DistortableImageOverlay(imageUrl, { corners: corners, opacity: opacity });

            m.set("layerGroup", "images");
            self.addLayer(imageLayer, m.get("layerGroup"));
            self.geometryMap.push({
              cid: m.cid,
              layer: imageLayer,
              type: type
            });
            $(imageLayer._image).css("z-index", 999);

            State.save();

            //diable (non-working) toolbar
            imageLayer.editing._showToolbar = function() { };

            //click on image overlay
            imageLayer.on("click", function(distortableImageOverlayClickEvent) {
              console.log("event.type = " + event.type);

              //only in mapmaker mode the image overlay is editable
              if (App.mode === "mapmaker") {
                //deselect old image
                if (self.currentImageLayer) {
                  self.currentImageLayer.editing.disable();
                }

                //keep reference of current image
                self.currentImageLayer = imageLayer;

                //enable edit mode on current image
                imageLayer.editing.enable();

                //set default editing mode (and refresh handles)
                self.setEditMode(m, "rotate");
              }
              Communicator.mediator.trigger("marker:click", m);
              distortableImageOverlayClickEvent.originalEvent.stopPropagation();
            });

            imageLayer.on("edit", function(e) {
              var corners = imageLayer.getCorners();
              m.set("corners", corners);
              State.save();
            });
          }

          self.updateLayerControl();
        }
      });
    },

    updatePrimaryColor: function() {
      var features = State.getPlugin('geojson_features').collection.where({ userColor: null });

      _.each(features, _.bind(function(feature) {
        this.updateMarker(feature);
      }, this));
    },

    setOpacity: function(m, value) {
      // Retrieve object from geometry mapping
      var geometryEntry = _.findWhere(this.geometryMap, { cid: m.cid });

      if (_.isObject(geometryEntry) && geometryEntry.type === "image") {
        var imageLayer = geometryEntry.layer;
        L.DomUtil.setOpacity(imageLayer._image, value);
        m.set("opacity", value);
      }
    },

    setEditMode: function(m, value) {
      // Retrieve object from geometry mapping
      var geometryEntry = _.findWhere(this.geometryMap, {cid: m.cid});

      if (_.isObject(geometryEntry) && geometryEntry.type === "image") {
        var imageLayer = geometryEntry.layer;
        //because the toolbar isn't working we're using an internal function here,
        //this could break in a future release of the DistortableImageOverlay plug-in
        if (imageLayer.editing._mode !== value) {
          imageLayer.editing._toggleRotateDistort();
        }
      }
    },

    updateMarker: function(m) {
      // Retrieve object from geometry mapping
      var geometryEntry = _.findWhere(this.geometryMap, { cid: m.cid });

      if (_.isObject(geometryEntry) && geometryEntry.type === "marker") {
        this.removeMarker(m);
        this.addMarker(m);
      }
    },

    /**
     * Take model of marker and remove it from the map.
     */

    removeMarker: function(m) {
      // Retrieve object from geometry mapping
      var marker = _.findWhere(this.geometryMap, { cid: m.cid });

      if (_.isObject(marker)) {
        m.off('change');
        this.removeMarkerGroup(marker.layer, m.get('layerGroup'));
        this.geometryMap = _.without(this.geometryMap, marker);

        this.updateLayerControl();
      }
    },

    /**
     * Adds a layer to a layergroup. If layergroup {key} doesn't exist, it will
     * be created.
     * @param layer - layer to be added
     * @param key - id of layergroup
     */
    addLayer: function(layer, key) {
      key = key || 'default';
      if ( _.isUndefined(this.layers[key]) ) {
        var layerGroup = L.layerGroup().addTo(this.map);
        this.layers[key] = layerGroup;
      }
      this.layers[key].addLayer(layer);
    },

    addMarkerGroup: function(layer, key) {
      key = key || 'default';
      if ( _.isUndefined(this.layers[key]) )
        this.layers[key] = new L.MarkerClusterGroup({
          iconCreateFunction: function (cluster) {
            var childCount = cluster.getChildCount();

            var c = ' marker-cluster-';
            if (childCount < 10) {
              c += 'small';
            } else if (childCount < 100) {
              c += 'medium';
            } else {
              c += 'large';
            }

            return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'color-primary marker-cluster' + c, iconSize: new L.Point(40, 40) });
          }
        }).addTo(this.map);
      this.layers[key].addLayer(layer);
    },

    removeMarkerGroup: function(layer, key) {
      key = key || 'default';
      this.layers[key].removeLayer(layer);
    },

    onShow: function() {

      var self = this;

      // Load map.
      this.updateMapSize();
      L.mapbox.accessToken = Config.mapbox.accessToken;
      this.map = L.mapbox.map(this.mapboxContainer, null, {
        boxZoom: true,
        worldCopyJump: true,
        fullscreenControl: true
      });
      this.setBaseMap();

      if (App.mode == 'mapmaker') {
        this.map.setView( State.getPlugin('map_settings').model.get('editorCenterPoint') || [52.121580, 5.6304], State.getPlugin('map_settings').model.get('editorZoom') || 8 );
      }
      else {
        this.map.setView( State.getPlugin('map_settings').model.get('centerPoint') || [52.121580, 5.6304], State.getPlugin('map_settings').model.get('zoom') || 8 );
      }

      Communicator.mediator.trigger('map:ready', this.map);   //this restores all features

      // Event handlers
      this.map.on('click', function(e) {
        Communicator.mediator.trigger( "map:tile-layer-clicked" );

        //disable editing mode on active image overlay
        if (self.currentImageLayer) {
          self.currentImageLayer.editing.disable();
          self.currentImageLayer = null;
        }
      });

      this.map.on('moveend', this.attachMoveEndListener);

    },

    updateLayerControl: function() {
      var images = this.layers["images"];
      if (images && _.isFunction(images.getLayers) && images.getLayers().length > 0) {
        $(".leaflet-control-layers-toggle").show();
      } else {
        $(".leaflet-control-layers-toggle").hide();
      }
    },

    attachMoveEndListener: function(e) {
      var self = this;

      this.map.off('moveend', this.attachMoveEndListener);

      this.map.on('moveend', function() {
        Communicator.mediator.trigger( "map:moveend", self.map )
      });
    },

    /**
     * Create an alternative to the L.divIcon marker, which does not support variable widths
     */
    registerAutoWidthMarker: function() {
      var self = this;
      L.DivIconAutosize = L.Icon.extend({
        options: {
          iconSize: [12, 12], // also can be set through CSS
          /*
           iconAnchor: (Point)
           popupAnchor: (Point)
           html: (String)
           bgPos: (Point)
           */
          iconHeight: 30,
          iconAnchorHeight: 44,
          className: 'leaflet-div-icon',
          html: false
        },

        createIcon: function (oldIcon) {
          var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

          div.innerHTML = options.html !== false ? options.html : '';
          this.options.iconSize = [undefined, this.options.iconHeight];
          this.options.iconAnchor = [105, this.options.iconAnchorHeight];

          if (options.bgPos) {
            div.style.backgroundPosition = (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
          }

          this._setIconStyles(div, 'icon');

          // Temporarily attach div to the dom so we can calculate the width.
          var $temp = $(div).clone().appendTo( '#' + self.mapboxContainer );
          $temp.width('auto');
          var w = $temp.outerWidth();
          $temp.remove();

          this.options.iconSize = [w, this.options.iconHeight];
          this.options.iconAnchor = [w / 2, this.options.iconAnchorHeight];

          // Necessary to set this twice, limitation of Leaflet
          this._setIconStyles(div, 'icon');

          return div;
        },

        createShadow: function () {
          return null;
        }
      });

      L.divIconAutosize = function (options) {
        return new L.DivIconAutosize(options);
      };
    },

    /**
     * Reduces the speed of Leaflet's mouse zooming.
     */
    registerLeafletZoomThrottle: function(throttle) {
      var lastScroll = new Date().getTime();
      L.Map.ScrollWheelZoom.prototype._onWheelScroll = function (e) {
        if (new Date().getTime() - lastScroll < throttle) { return; }
        var delta = L.DomEvent.getWheelDelta(e);
        var debounce = this._map.options.wheelDebounceTime;

        this._delta += delta;
        this._lastMousePos = this._map.mouseEventToContainerPoint(e);

        if (!this._startTime) {
          this._startTime = +new Date();
        }

        var left = Math.max(debounce - (+new Date() - this._startTime), 0);

        clearTimeout(this._timer);
        lastScroll = new Date().getTime();
        this._timer = setTimeout(L.bind(this._performZoom, this), left);

        L.DomEvent.stop(e);
      }
    },

    setBaseMap: function() {

      var self = this,
        tileId = State.getPlugin('map_settings').model.get('baseMap'),
        tile = _.findWhere( Config.tiles, {id: tileId} );

      if (!tile) return;

      if (self.baseLayer) self.map.removeLayer(self.baseLayer);
      if (tile.type == "mapbox") {
        self.baseLayer = L.mapbox.tileLayer( tile.id ).addTo( self.map );
      } else {
        // Mapbox does not respect detectRetina option. See issue #8581.
        var tileOptions = {
          attribution: tile.tilejson.attribution || 'Geen toerekening',
          minZoom: tile.tilejson.minZoom || 0,
          maxZoom: tile.tilejson.maxZoom || 18
        };
        self.baseLayer = L.tileLayer( tile.tilejson.tiles, tileOptions ).addTo( self.map );
      }

    },

    updateMapSize: function() {

      this.height = $( window ).height();
      if ($('header').css('display') != 'none') {
        this.height -= $( 'header' ).height();
      }
      this.width = $( window ).width();
      $( '#' + this.mapboxContainer ).css( 'height', this.height );

    }

  });

});