require( [
    'require-config'
  ],
  function() {

  require(['backbone', 'erfgeoviewer.common', 'communicator', 'jquery',
    'views/map', 'views/header', 'views/markers', 'views/detail', 'views/basemap',
    'plugins/routeyou/routeyou', 'erfgeoviewer.search', 'plugins/draw/draw',
    'models/layers', 'models/state'],

  function(Backbone, App, Communicator, $,
           MapView, HeaderView, MarkerAddView, DetailView, BaseMapSelector,
           RouteyouModule, SearchModule, DrawModule,
           LayerCollection, StateModel) {

    /**
     * Init.
     */

    console.log('Erfgeoviewer: mapmaker mode.');

    // This object will be serialized and used for storing/restoring a map.
    var state = new StateModel({ id: 1 });

    var search_module = new SearchModule( {
      markers_collection: state.get( 'markers' )
    } );

    var map_view = new MapView( {
      layout: App.layout,
      markers: state.get( 'markers' ),
      state: state
    } );

    App.layout.getRegion( 'content' ).show( map_view );
    App.layout.getRegion( 'header' ).show( new HeaderView( {
      modalRegion: App.layout.getRegion( 'modal' ),
      state: state
    } ) );

    var draw_module = new DrawModule({
      map_view: map_view
    });

    /**
     * Router.
     */

    var Router = Marionette.AppRouter.extend( {
      routes: {
        "": function() {
        },
        "markers": function() {
          var marker_view = new MarkerAddView( {
            searchModule: search_module
          } );
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).show( marker_view );
        },
        "base": function() {
          App.flyouts.getRegion( 'bottom' ).show( new BaseMapSelector( {state: state} ) );
        },
        "features": function() {
          console.log( 'features' );
        }
      }
    } );
    var router = new Router();
    Communicator.reqres.setHandler("app:get", function() { return App; });
    Communicator.reqres.setHandler("router:get", function() { return router; });


    /**
     * Optional modules.
     */
    new RouteyouModule( { state: state } );

    state.fetch();
    App.start();

    /**
     * Event handlers.
     */
    Communicator.mediator.on("map:tile-layer-clicked", function() {
      if (!App.flyouts.getRegion('detail').hasView() || !App.flyouts.getRegion('detail').isVisible() ) {
        router.navigate("");
      }
    });
    Communicator.mediator.on("marker:click", function(m) {
      App.flyouts.getRegion('detail').show( new DetailView( { model: m } ));
    });
    Communicator.mediator.on( "all", function( e, a ) {
      // Debugging:
      console.log( "event: " + e, a );
    } );



  });

});