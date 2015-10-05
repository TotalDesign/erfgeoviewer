/**
 * Responsible for registering route, creating the view for selecting a route,
 * maintaining state of routes (storing/restoring).
 */
define( ["backbone", 'backbone.marionette', 'plugins/module', 'communicator', 'underscore',
    'models/marker', 'models/state',
    'plugins/routeyou/route-list', 'plugins/routeyou/route-view'],
  function(Backbone, Marionette, ErfGeoviewerModule, Communicator, _,
    MarkerModel, State,
    RouteListCollection, RouteSelector) {

    return ErfGeoviewerModule.extend({

      module: {
        'type': 'library',
        'title': 'RouteYou'
      },

      markers: null,
      regexPoint: /POINT\((-?\d+\.[0-9]+)\s(-?[0-9]+\.[0-9]+)/,
      routeLayerGroup: null,
      routeyou_view: false,
      selector_view: false,
      style: {
        previewRoute: {
          color: '#000',
          dashArray: "10, 10",
          opacity: 0.4
        },
        savedRoute: {
          color: '#000',
          dashArray: false,
          opacity: 0.7
        }
      },

      initialize: function( o ) {

        var self = this;
        _.bindAll(this, 'showSelector');

        State.registerPlugin('routeyou');
        this.markers = State.get('markers');

        this.availableRoutes_collection = new RouteListCollection();
        this.addedRoutes_collection = new Backbone.Collection();

        this.availableRoutes_collection.fetch().done(function() {
          if (Backbone.history.getFragment() == 'routes') {
            self.showSelector();
          }
        });

        this.app = Communicator.reqres.request("app:get");
        this.router = Communicator.reqres.request("router:get");
        this.router.route("routes", "routeyou");
        this.router.on('route:routeyou', this.showSelector, this);

        /**
         * Event handlers.
         *
         */
        Communicator.mediator.on("routeyou:showPreview", function(model) {
          self.showPreview( model );
        });

        Communicator.mediator.on('map:ready', function(map) {
          self.map = map;
          self.routeLayerGroup = L.layerGroup().addTo(map);
          self.resetRoutes();
        }, this);

        // Called during save.
        Communicator.reqres.setHandler("saving:routeyou", function() {
          return self.addedRoutes_collection.toJSON();
        });

        // Called during restore.
        Communicator.reqres.setHandler("restoring:routeyou", function(request) {
          if (request.routeyou) {
            var ry = request.routeyou;
            if ( _.isString( ry) ) ry = JSON.parse(ry);
            self.addedRoutes_collection = new Backbone.Collection(ry);
            self.resetRoutes();
          }
        });

      },

      importPOIs: function(e) {

        var self = this,
            pois = this.previewingModel.get('pois'),
            routeId = 'route-' + this.previewingModel.get('id');

        if (pois.length > 0) {
          _.each(pois, function(poi) {
            var point = poi.location.centroid.wkt.match(self.regexPoint);
            var markerObj = {
              title: poi.location.name.nl,
              description: poi.text.description.nl,
              externalUrl: '',
              longitude: [point[1]],
              latitude: [point[2]],
              layerGroup: routeId
            };
            if (_.getPath(poi, "text.type.id") == 1) {
              markerObj.image = _.getPath(poi, "text.media.url.nl");
            }
            self.markers.push(new MarkerModel(markerObj));
          });
        }

      },

      /**
       * Redraws routes based on collection.
       */
      resetRoutes: function() {
        var self = this;
        if (!this.routeLayerGroup) {
          console.log('map not yet available, no routes to reset.');
          return;
        }
        this.routeLayerGroup.clearLayers();
        this.addedRoutes_collection.each(function(route) {
          L.polyline( route.get('geo'), self.style.savedRoute ).addTo( self.routeLayerGroup );
        });
      },

      removePreview: function(o) {
        if (this.previewLayer) {
          if (!o.saving) {
            this.map.removeLayer(this.previewLayer);
            this.routeyou_view.disableActions();
          }
          this.previewLayer = null;
        }
      },

      /**
       * Once user clicks "Route Toevoegen", this is called.
       */
      saveRoute: function() {
        this.previewLayer.setStyle(this.style.savedRoute);
        this.routeLayerGroup.addLayer( this.previewLayer );
        var route = this.previewingModel.clone();
        this.addedRoutes_collection.add( route );

        console.log(route);
        var begin = route.get('begin').wkt.match(this.regexPoint),
          end = route.get('end').wkt.match(this.regexPoint),
          layerGroup = 'route-' + route.get('id');

        var startMarker = {
          title: 'Begin',
          description: 'Begin van route: ' + route.get('name').nl,
          externalUrl: 'http://www.routeyou.com/nl-nl/route/view/' + route.get('id'),
          longitude: [begin[1]],
          latitude: [begin[2]],
          layerGroup: layerGroup
        };
        var endMarker = _.defaults({
          title: 'Eind',
          description: 'Eind van route: ' + route.get('name').nl,
          longitude: [end[1]],
          latitude: [end[2]]
        }, startMarker);
        this.markers.push(new MarkerModel(startMarker));
        this.markers.push(new MarkerModel(endMarker));

        this.removePreview({ saving: true });
      },

      /**
       * A route is previewed after selected from a drop down, but is not officially
       * added to the saveable map.
       */
      showPreview: function( model ) {
        this.previewingModel = model;
        var route = model.get('geo');
        if (route) {
          this.routeyou_view.enableActions();
        } else {
          this.routeyou_view.disableActions();
        }
        if (this.previewLayer) this.map.removeLayer(this.previewLayer);
        this.previewLayer = L.polyline( route, this.style.previewRoute ).addTo( this.map );
        this.map.fitBounds( this.previewLayer.getBounds() );
      },

      showSelector: function() {
        var self = this;
        var isFetched = function() {
          self.routeyou_view = new RouteSelector( {
            availableRoutes_collection: self.availableRoutes_collection,
            map: self.map,
            controller: self
          } );
          self.app.flyouts.getRegion( 'right' ).show( self.routeyou_view, { someOpt: true } );
        };
        if (this.availableRoutes_collection.length > 0) {
          isFetched();
        } else {
          this.availableRoutes_collection.fetch().done(isFetched);
        }
      }

    } );

  } );