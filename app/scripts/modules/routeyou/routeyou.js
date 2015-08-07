define( ["backbone", 'backbone.marionette', 'modules/module', 'communicator',
    'modules/routeyou/route-collection', 'modules/routeyou/route-view'],
  function(Backbone, Marionette, ErfGeoviewerModule, Communicator,
    RouteCollection, RouteSelector) {

    return ErfGeoviewerModule.extend({

      module: {
        'type': 'library',
        'title': 'RouteYou'
      },

      selector_view: false,

      initialize: function( o ) {

        var self = this;
        _.bindAll(this, 'showSelector');

        this.route_collection = new RouteCollection();
        var promise = this.route_collection.fetch();

        this.app = Communicator.reqres.request("app:get");
        this.router = Communicator.reqres.request("router:get");
        this.router.route("routes", "routeyou");
        this.router.on('route:routeyou', this.showSelector, this);

        promise.done(function() {
          if (Backbone.history.getFragment() == 'routes') {
            self.showSelector();
          }
        });


      },

      showSelector: function() {
        if ( this.route_collection.length > 0 ) {
          var routeyou_view = new RouteSelector( {
            collection: this.route_collection
          } );
          this.app.flyouts.getRegion( 'right' ).show( routeyou_view, { someOpt: true } );
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