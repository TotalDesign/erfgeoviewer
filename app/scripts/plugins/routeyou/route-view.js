define( ["backbone", "backbone.marionette", "communicator", "config", "polyline", "jquery",
         "tpl!plugins/routeyou/route-selector.html"],

  function( Backbone, Marionette, Communicator, Config, Polyline, $,
            RouteSelectorTemplate ) {

    return Marionette.ItemView.extend( {

      els: {},
      previewLayer: null,
      template: RouteSelectorTemplate,
      routeLayerGroup: null,
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

      events: {
        "change #edit-route": "getGeo",
        "click .button-add-route": function(e) {
          e.preventDefault();
          if ($(e.target).hasClass('disabled')) return;
          this.saveRoute();
        },
        "click .button-add-points": function(e) {
          e.preventDefault();
          if ($(e.target).hasClass('disabled')) return;
          console.log('add points');
        }
      },

      initialize: function(o) {
        var self = this;
        this.available_routes = o.available_routes;
        this.added_routes = o.added_routes;
        this.model = new Backbone.Model();
        this.model.set('routes', this.available_routes.toArray());

        this.available_routes.on("change:geo", function(model) {
          self.showPreview( model );
        });
      },

      onShow: function() {
        this.els.addRouteButton = $('.button-add-route', this.$el);
        this.els.addPointsButton = $('.button-add-points', this.$el);
        this.map = Communicator.reqres.request( "getMap" );
        this.routeLayerGroup = L.layerGroup().addTo(this.map);
        this.added_routes.add()
      },

      /* ---- end marionette functions ---- */

      getGeo: function(e) {
        var self = this;
        var id = $( e.target ).val();
        if ( id > 0 ) {
          $.ajax( Config.routeyou_proxy.uri + '/routeyou/api/get_route/' + id )
            .done( function( msg ) {
              msg.geo = Polyline.decode( msg.geo );
              id = parseInt(id);
              var model = self.available_routes.findWhere( { id: id });
              model.set(msg);
              self.available_routes.set( model, {remove: false} );
            } );
        } else {
          this.removePreview();
        }
      },

      removePreview: function(beingSaved) {
        this.previewingModel = null;
        if (this.previewLayer) {
          if (!beingSaved) this.map.removeLayer(this.previewLayer);
          this.previewLayer = null;
        }
        this.els.addRouteButton.addClass( 'disabled' );
        this.els.addPointsButton.addClass( 'disabled' );
      },

      /**
       * Redraws routes based on collection.
       */
      resetRoutes: function() {
        console.log('reset routes');
        var self = this;
        this.routeLayerGroup.clearLayers();
        this.added_routes.each(function(route) {
          console.log('add route', route);
          L.polyline( route, self.style.savedRoute ).addTo( self.routeLayerGroup );
        });
      },

      /**
       * Once user clicks "Route Toevoegen", this is called.
       */
      saveRoute: function() {
        this.previewLayer.setStyle(this.style.savedRoute);
        this.routeLayerGroup.addLayer( this.previewLayer );
        this.added_routes.add( this.previewingModel.clone() );
        this.removePreview(true);
      },

      /**
       * A route is previewed after selected from a drop down, but is not officially
       * added to the saveable map.
       */
      showPreview: function( model ) {
        this.previewingModel = model;
        var route = model.get('geo');
        if (route) {
          this.els.addRouteButton.removeClass( 'disabled' );
          this.els.addPointsButton.removeClass( 'disabled' );
        }
        if (this.previewLayer) this.map.removeLayer(this.previewLayer);
        this.previewLayer = L.polyline( route, this.style.previewRoute ).addTo( this.map );
        this.map.fitBounds( this.previewLayer.getBounds() );
      },

      togglePOIs: function(e) {

        var self = this;
        var id = $( e.target ).val();

        // Do not show POIs if there is no route.
        if ( !this.layers.route || !$( e.target ).is(':checked') ) {
          if ( this.layers.pois ) this.map.removeLayer( this.layers.pois );
          return;
        }

        var pois = this.model.get('pois');
        if (pois.length > 0) {
          if ( this.layers.pois ) this.map.removeLayer( this.layers.pois );
          var markers = [];
          _.each(pois, function(poi) {
            var re = /POINT\((-?\d+\.[0-9]+)\s(-?[0-9]+\.[0-9]+)/;
            var point = poi.location.centroid.wkt.match(re);
            markers.push(
              L.marker([point[2], point[1]] ).bindPopup(poi.text.description.nl)
            );
          });
          this.layers.pois = L.layerGroup(markers ).addTo( this.map );
        }


      }

    } );

  } );