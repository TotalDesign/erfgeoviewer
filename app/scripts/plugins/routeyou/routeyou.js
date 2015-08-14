define( ["backbone", 'backbone.marionette', 'plugins/module', 'communicator',
    'plugins/routeyou/route-list', 'plugins/routeyou/route-view'],
  function(Backbone, Marionette, ErfGeoviewerModule, Communicator,
    RouteListCollection, RouteSelector) {

    return ErfGeoviewerModule.extend({

      module: {
        'type': 'library',
        'title': 'RouteYou'
      },

      routeyou_view: false,
      selector_view: false,
      state: null,

      initialize: function( o ) {

        var self = this;
        _.bindAll(this, 'showSelector');

        this.state = o.state;
        this.state.registerParser('routeyou');

        this.available_routes = new RouteListCollection();
        this.added_routes = new Backbone.Collection();

        var promise = this.available_routes.fetch();

        this.app = Communicator.reqres.request("app:get");
        this.router = Communicator.reqres.request("router:get");
        this.router.route("routes", "routeyou");
        this.router.on('route:routeyou', this.showSelector, this);

        promise.done(function() {
          if (Backbone.history.getFragment() == 'routes') {
            self.showSelector();
          }
        });

        // Called during save.
        Communicator.reqres.setHandler("saving:routeyou", function() {
          return JSON.stringify(self.added_routes.toJSON());
        });

        // Called during restore.
        Communicator.reqres.setHandler("restoring:routeyou", function(request) {
          if (request.routeyou) {
            var ry = JSON.parse(request.routeyou);
            return new Backbone.Collection(ry);
          } else
            return false;
        });

        // Called when file is opened.
        // TODO
        Communicator.mediator.on("state:reset", function() {
          console.log('routeyou initializing after file is opened');
          self.availableRoutes = self.state.get('routeyou');
          if (self.routeyou_view) {
            self.routeyou_view.resetRoutes();
          }
        });

      },

      showSelector: function() {
        if ( this.available_routes.length > 0 ) {
          this.routeyou_view = new RouteSelector( {
            available_routes: this.available_routes,
            added_routes: this.added_routes
          } );
          this.app.flyouts.getRegion( 'right' ).show( this.routeyou_view, { someOpt: true } );
        } else {
          // TODO: Replace wait screen.
          var Waiting = Marionette.ItemView.extend({
            template: _.template('Even wachten...')
          });
          this.app.flyouts.getRegion( 'right' ).show( new Waiting() );
        }

      }

    } );

  } );