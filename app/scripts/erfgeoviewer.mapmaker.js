require([
	'require-config'
],
function ( RequireJSConfig ) {
    'use strict';

	require(['backbone', 'erfgeoviewer.common', 'communicator',
    'views/map', 'views/header', 'views/markers', 'views/detail', 'views/basemap',
    'modules/routeyou/routeyou', 'erfgeoviewer.search',
    'models/layers', 'models/state'],

  function(Backbone, App, Communicator,
           MapView, HeaderView, MarkerAddView, DetailView, BaseMapSelector,
           RouteyouModule, SearchModule,
           LayerCollection, StateModel) {

    /**
     * Init.
     */

    console.log('Erfgeoviewer: mapmaker mode.');

    // This object will be serialized and used for storing/restoring a map.
    var state = new StateModel({ id: 1 });
    state.fetch();

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
          App.flyouts.getRegion( 'right' ).show( marker_view );
        },
        "base": function() {
          App.flyouts.getRegion( 'bottom' ).show( new BaseMapSelector( {state: state} ) );
        },
        "features": function() {
          console.log( 'features' );
        },
        "routes": function() {
          console.log('routes');
          //var marker_view = new RouteyouView();
          //flyouts.getRegion( 'right' ).show( marker_view );
        }
      }
    } );
    var router = new Router();

    App.start();

    /**
     * Event handlers.
     */

    Communicator.reqres.on("router:get", function() {
      return router;
    });
    Communicator.mediator.on("map:tile-layer-clicked", function() {
      if (!App.flyouts.getRegion('detail').hasView() || !App.flyouts.getRegion('detail').isVisible() ) {
        App.flyouts.getRegion('right').hideFlyout();
        router.navigate("");
      }
      App.flyouts.getRegion('bottom').hideFlyout();
      App.flyouts.getRegion('detail').hideFlyout();
    });
    Communicator.mediator.on("marker:click", function(m) {
      App.flyouts.getRegion('detail').show( new DetailView( { model: m } ));
    });
    Communicator.mediator.on( "all", function( e, a ) {
      // Debugging:
      console.log( "event: " + e, a );
    } );



  })

});
