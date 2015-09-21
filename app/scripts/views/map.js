/**
 * Map control, shared between mapmaker and reader modes.
 * Functionality specific to mapmaker or reader should be placed in separte plugins.
 */
define(["backbone", "backbone.marionette", "leaflet", "d3", "communicator", "config", "jquery", "underscore",
        "leaflet.markercluster", "leaflet.smoothmarkerbouncing", "leaflet.proj", "leaflet.fullscreen",
        "models/markers", "tpl!template/map.html", "vendor/sparql-geojson"],
  function(Backbone, Marionette, L, d3, Communicator, Config, $, _,
           LeafletMarkerCluster, LeafletBouncing, LeafletProjections, LeafletFullscreen,
           MarkersCollection, Template) {

  return Marionette.ItemView.extend({

    // Marionette properties.
    events: {},
    template: Template,

    // ID of dom element where Leaflet will be rendered.
    mapboxContainer: "map",

    // Map models to geometry by cid
    geometryMap: [],

    layers: {},

    // Marionette layout instance.
    layout: null,

    // Instance of a PopupView.
    popup: null,

    // Collections
    markerCollection: null,

    updateOnPositionChange: true,

    initialize: function(o) {

      var self = this;
      _.bindAll(this, 'updateMapSize', 'addMarker');

      this.state = o.state;
      this.layout = o.layout;
      this.layers.markers = new L.MarkerClusterGroup();
      this.markerCollection = this.state.get('markers');

      $( window ).resize( _.throttle( this.updateMapSize, 150 ) );

      // this.registerAutoWidthMarker();
      this.registerLeafletZoomThrottle(200);

      /**
       * Event listeners
       */
      Communicator.mediator.on('map:setPosition', function(options) {
        self.map.setView(options.centerPoint, options.zoom);
      });
      Communicator.mediator.on('map:resetEditorPosition', function() {
        if (self.state.get( 'mapSettings').editorCenterPoint) {
          self.map.setView(self.state.get( 'mapSettings').editorCenterPoint, self.state.get( 'mapSettings').editorZoom);
        }
      });
      Communicator.mediator.on('map:setUpdateOnPositionChange', function(value) {
        self.updateOnPositionChange = value;
      });
      Communicator.mediator.on( 'map:moveend', function(map) {
        if (self.updateOnPositionChange) {
          var mapSettings = self.state.get( 'mapSettings' ),
            override = {
              editorCenterPoint: map.getCenter(),
              editorZoom: map.getZoom()
            };

          mapSettings = _.extend( mapSettings, override );

          self.state.set( 'mapSettings', mapSettings );
          self.state.save();
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
      Communicator.mediator.on("map:changeBase", function(tileId) {
        self.setBaseMap(tileId);
      });
      Communicator.mediator.on("map:updateSize", function() {
        _.throttle( self.updateMapSize, 150 )
      });
      Communicator.reqres.setHandler( "getMap", function() { return self.map; });
      this.state.on("change:baseMap", function(model) {
        self.setBaseMap(model.get('baseMap'));
      });

      /**
       * State management.
       */
      Communicator.reqres.setHandler( "saving:markers", function() {
        return self.markerCollection.toJSON();
      });

      Communicator.reqres.setHandler( "restoring:mapSettings", function(response) {
        if ( _.isString( response.mapSettings ) )
          response.mapSettings = JSON.parse( response.mapSettings );
        return response.mapSettings;
      });
      Communicator.reqres.setHandler( "restoring:baseMap", function(response) {
        if (response.baseMap) self.setBaseMap(response.baseMap);
      });
      Communicator.reqres.setHandler( "restoring:markers", function(response) {
        if (response.markers) {
          self.markerCollection.reset();
          if ( _.isString( response.markers ) ) {
            response.markers = JSON.parse( response.markers );
          }
          self.markerCollection.add(response.markers);
          self.layers.markers.clearLayers();
          self.markerCollection.each(function(m) {
            self.addMarker(m);
          });
        }
      });

      this.initMap = _.bind(this._initMap, this);

      this.state.on('change:mapSettings', this.initMap)
    },

    _initMap: function() {
      this.state.off('change:mapSettings', this.initMap);

      this.map.setView( this.state.get( 'mapSettings' ).editorCenterPoint || [52.121580, 5.6304], this.state.get( 'mapSettings' ).editorZoom || 8 );
    },

    /**
     * Take model of marker and add to map.
     * @param m - model
     */
    addMarker: function(marker) {
      var self = this,
        markers = (_.isArray(marker)) ? marker : [marker],
        geojson,
        spatial;

      _.each(markers, function(m) {
        if (_.isEmpty(m.get( 'spatial' )) && (!m.get( 'latitude' ) || !m.get( 'longitude' ))) {
          console.log('invalid marker:', m);
          return false;
        }

        if (spatial = m.get( 'spatial' )) {
          geojson = _.extend({ properties: {
            title: m.get('title'),
            'marker-color': Config.colors.primary
          }}, sparqlToGeoJSON(m.get( 'spatial' )[0]));
        }
        else {
          geojson = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [m.get( 'longitude' )[0], m.get( 'latitude' )[0]]
            },
            properties: {
              title: m.get('title'),
              'marker-color': Config.colors.primary
            }
          };
        }

        var marker = L.mapbox.featureLayer();
        marker.setGeoJSON(geojson);
        marker.on("click", function() {
          Communicator.mediator.trigger("marker:click", m)
        });
        self.addMarkerGroup(marker, m.get('layerGroup'));

        self.geometryMap.push({
          cid: m.cid,
          featureLayer: marker
        });
      });
    },

    /**
     * Take model of marker and remove it from the map.
     */
    removeMarker: function(m) {
      // Retrieve object from geometry mapping
      var marker = _.findWhere(this.geometryMap, { cid: m.cid });

      if (_.isObject(marker)) {
        this.removeMarkerGroup(marker.featureLayer, m.get('layerGroup'));
        this.geometryMap = _.without(this.geometryMap, marker);
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
      if ( _.isUndefined(this.layers[key]) )
        this.layers[key] = L.layerGroup().addTo(this.map);
      this.layers[key].addLayer(layer);
    },

    addMarkerGroup: function(layer, key) {
      key = key || 'default';
      if ( _.isUndefined(this.layers[key]) )
        this.layers[key] = new L.MarkerClusterGroup().addTo(this.map);
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
      this.setBaseMap( this.state.get('baseMap') || "osm" );

      this.map.setView( this.state.get( 'mapSettings').editorCenterPoint || [52.121580, 5.6304], this.state.get( 'mapSettings').editorZoom || 8 );
      Communicator.mediator.trigger('map:ready', this.map);

      // Initialize markers
      this.layers.markers = new L.MarkerClusterGroup().addTo(this.map);
      if (this.markerCollection.length > 0) {
        this.markerCollection.each(function(m) {
          self.addMarker(m);
        });
      }
      this.layers.markers.addTo(this.map);
      this.markerCollection.on("add", function(m) {
        if (!m.get('spatial') && (!m.get('latitude') || !m.get('longitude'))) return false;
        self.addMarker(m);
      });
      this.markerCollection.on("remove", function(m) {
        if (!m.get('spatial') && (!m.get('latitude') || !m.get('longitude'))) return false;
        self.removeMarker(m);
      });

      // Event handlers
      this.map.on('click', function(e) {
        Communicator.mediator.trigger( "map:tile-layer-clicked" );
      });

      this.map.on('moveend', function(e) {
        Communicator.mediator.trigger( "map:moveend", self.map );
      });

      this.map.on('boxzoomend', function(e) {

        _.each(self.layers.markers.getLayers(), function(marker) {
          if (e.boxZoomBounds.contains(marker.getLatLng())) {
            marker.feature.properties['marker-color'] = Config.colors.secondary;
          } else {
            marker.feature.properties['marker-color'] = Config.colors.primary;
          }
          marker.setGeoJSON(marker.fe)
        });
      });

      // SVG from Leaflet.
      this.map._initPathRoot();
      this.svg = d3.select('#' + this.mapboxContainer).select("svg");
      this.g = this.svg.append("g");

    },

    /**
     * Create an alternative to the L.divIcon marker, which does not support variablee widths
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

    setBaseMap: function(tileId) {
      var self = this;
      var tile = _.findWhere( Config.tiles, {id: tileId} );
      if (!tile) return;
      if (self.baseLayer) self.map.removeLayer(self.baseLayer);
      if (tile.type == "mapbox") {
        self.baseLayer = L.mapbox.tileLayer( tile.id ).addTo( self.map );
      } else {
        self.baseLayer = L.mapbox.tileLayer( tile.tilejson ).addTo( self.map );
      }
      self.state.set('baseMap', tile.id );
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