define( ["backbone", 'backbone.marionette', 'modules/module',
    'modules/routeyou/route-collection', 'modules/routeyou/route-view'],
  function(Backbone, Marionette, ErfGeoviewerModule,
    RouteCollection, RouteSelector) {

    return ErfGeoviewerModule.extend({

      region: null,

      module: {
        'type': 'library',
        'title': 'RouteYou'
      },

      initialize: function( o ) {

        var self = this;
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