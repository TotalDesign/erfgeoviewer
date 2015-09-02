require( [
    'require-config'
  ],
  function() {

  require(['backbone', 'erfgeoviewer.common', 'communicator', 'jquery',
    'views/map', 'views/header', 'views/markers', 'views/settings', 'views/detail', 'views/basemap', 'views/publish',
    'plugins/routeyou/routeyou', 'erfgeoviewer.search', 'plugins/draw/draw',
    'models/layers', 'models/state'],

  function(Backbone, App, Communicator, $,
           MapView, HeaderView, MarkerAddView, SettingsView, DetailView, BaseMapSelector, PublishView,
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


    /**
     * Event handlers.
     */

    Communicator.mediator.on('map:ready', function() {
      state.fetch();
    });
    Communicator.mediator.on("marker:click", function(m) {
      App.flyouts.getRegion('detail').show( new DetailView( { model: m } ));
    });
    Communicator.mediator.on( "all", function( e, a ) {
      // Debugging:
      console.log( "EVENT '" + e + "'", a );
    } );


    /**
     * Router.
     */

    var Router = Marionette.AppRouter.extend( {
      routes: {
        "": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).hideFlyout();
        },
        "export": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).show(new PublishView({
            state: state
          }));
        },
        "settings": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).show(new SettingsView({
            state: state
        }));
        },
        "add": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).hideFlyout();
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

    new DrawModule();
    new RouteyouModule( {state: state} );


    /**
     * Initialize map.
     */

    App.map_view = new MapView( {
      layout: App.layout,
      state: state
    } );

    App.layout.getRegion( 'content' ).show( App.map_view );
    App.layout.getRegion( 'header' ).show( new HeaderView( {
      modalRegion: App.layout.getRegion( 'modal' ),
      state: state
    } ) );
    App.start();

  });

});