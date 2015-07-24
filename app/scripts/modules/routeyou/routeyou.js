define( ['backbone.marionette', 'modules/module',
    'modules/routeyou/route-collection', 'modules/routeyou/route-view'],
  function(Marionette, ErfGeoviewerModule,
    RouteCollection, RouteSelector) {

    return ErfGeoviewerModule.extend({

      region: null,

      module: {
        'type': 'library',
        'title': 'RouteYou'
      },

      initialize: function( o ) {

        var self = this;
        console.log(o);
        this.region = o.region;
        var route_collection = new RouteCollection();
        route_collection.fetch( {
          success: function( c ) {
            self.region.show( new RouteSelector( {
              collection: c
            } ) );
          }
        } );
      }

    } );

  } );