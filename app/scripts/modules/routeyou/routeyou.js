define( ['backbone.marionette',
    'modules/routeyou/route-collection', 'modules/routeyou/route-view'],
  function(Marionette,
    RouteCollection, RouteSelector) {

    return Marionette.Object.extend( {

      region: null,

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