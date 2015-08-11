define( ["backbone", "backbone.marionette", "communicator", "config", "polyline", "jquery",
         "tpl!plugins/routeyou/route-selector.html"],

  function( Backbone, Marionette, Communicator, Config, Polyline, $,
            RouteSelectorTemplate ) {

    return Marionette.ItemView.extend( {

      els: {},
      previewLayer: null,
      template: RouteSelectorTemplate,

      events: {
        "change #edit-route": "getGeo",
        "click .button-add-route": function(e) {
          e.preventDefault();
          if ($(e.target).hasClass('disabled')) return;
          console.log('add route');
        },
        "click .button-add-points": function(e) {
          e.preventDefault();
          if ($(e.target).hasClass('disabled')) return;
          console.log('add points');
        }
      },

      initialize: function(o) {
        var self = this;
        this.collection = o.collection;
        this.model = new Backbone.Model();
        this.model.set('routes', this.collection.toArray());

        this.collection.on("change:geo", function(model) {
          self.showPreviewRoute( model.get( 'geo' ) );
        });
      },

      onShow: function() {
        this.els.addRouteButton = $('.button-add-route', this.$el);
        this.els.addPointsButton = $('.button-add-points', this.$el);
        this.map = Communicator.reqres.request( "getMap" );
      },

      showPreviewRoute: function( route ) {
        if (route) {
          this.els.addRouteButton.removeClass( 'disabled' );
          this.els.addPointsButton.removeClass( 'disabled' );
        }
        var o = {
          color: '#000',
          dashArray: "5, 5",
          opacity: 0.4
        };
        if (this.previewLayer) this.map.removeLayer(this.previewLayer);
        this.previewLayer = L.polyline( route, o ).addTo( this.map );
        this.map.fitBounds( this.previewLayer.getBounds() );
      },

      getGeo: function(e) {
        var self = this;
        var id = $( e.target ).val();
        if ( id > 0 ) {
          $.ajax( Config.routeyou_proxy.uri + '/routeyou/api/get_route/' + id )
            .done( function( msg ) {
              msg.geo = Polyline.decode( msg.geo );
              id = parseInt(id);
              var model = self.collection.findWhere( { id: id });
              model.set(msg);
              self.collection.set( model, {remove: false} );
            } );
        } else {
          if (this.previewLayer) {
            this.map.removeLayer(this.previewLayer);
            this.previewLayer = null;
          }
          this.els.addRouteButton.addClass( 'disabled' );
          this.els.addPointsButton.addClass( 'disabled' );
        }
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