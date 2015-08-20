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
          this.els.addRouteButton.addClass( 'disabled' );
          this.controller.saveRoute();
        },
        "click .button-add-points": function(e) {
          e.preventDefault();
          if ($(e.target).hasClass('disabled')) return;
          this.els.addPointsButton.addClass( 'disabled' );
          this.controller.previewPOIs();
        },
        'click .hide-flyout': function(e) {
          Communicator.mediator.trigger('flyouts:hideRegionById', $(e.target).closest('.region').attr('id'));
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

      disableActions: function() {
        this.els.addRouteButton.addClass('disabled');
        this.els.addPointsButton.addClass('disabled');
      },

      enableActions: function() {
        this.els.addRouteButton.removeClass('disabled');
        this.els.addPointsButton.removeClass('disabled');
      },

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
      }

    } );

  } );