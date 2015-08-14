define( ["backbone", "backbone.marionette", "communicator", "config", "polyline", "jquery",
         "tpl!plugins/routeyou/route-selector.html"],

  function( Backbone, Marionette, Communicator, Config, Polyline, $,
            RouteSelectorTemplate ) {

    return Marionette.ItemView.extend( {

      els: {},
      template: RouteSelectorTemplate,

      events: {
        "change #edit-route": "getGeo",
        "click .button-add-route": function(e) {
          e.preventDefault();
          if ($(e.target).hasClass('disabled')) return;
          this.controller.saveRoute();
        },
        "click .button-add-points": function(e) {
          e.preventDefault();
          if ($(e.target).hasClass('disabled')) return;
        }
      },

      initialize: function(o) {
        var self = this;
        this.map = o.map;
        this.controller = o.controller;
        this.availableRoutes_collection = o.availableRoutes_collection;
        this.model = new Backbone.Model();
        this.model.set('routes', this.availableRoutes_collection.toArray());
      },

      onShow: function() {
        this.els.addRouteButton = $('.button-add-route', this.$el);
        this.els.addPointsButton = $('.button-add-points', this.$el);
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
              var model = self.availableRoutes_collection.findWhere( { id: id });
              model.set(msg);
              self.availableRoutes_collection.set( model, {remove: false} );
            } );
        } else {
          this.controller.removePreview();
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