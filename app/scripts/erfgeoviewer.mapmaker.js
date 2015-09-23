require( [
    'require-config'
  ],
  function() {
  require(['backbone', 'erfgeoviewer.common', 'communicator', 'jquery', 'config',
    'views/map', 'views/header', 'views/search', 'views/settings', 'views/detail', 'views/detail-settings', 'views/basemap', 'views/publish',  'views/layout/detail.layout',
    'plugins/routeyou/routeyou', 'erfgeoviewer.search', 'plugins/draw/draw',
    'models/layers', 'models/state', 'models/maki'],

  function(Backbone, App, Communicator, $, Config,
           MapView, HeaderView, SearchView, SettingsView, DetailView, DetailSettingsView, BaseMapSelector, PublishView, DetailLayout,
           RouteyouModule, SearchModule, DrawModule,
           LayerCollection, StateModel, MakiCollection) {

    /**
     * Init.
     */

    console.log('Erfgeoviewer: mapmaker mode.');

    // This object will be serialized and used for storing/restoring a map.
    var state = new StateModel({
      id: 1,
      mapSettings: {
        primaryColor: Config.colors.primary,
        secondaryColor: Config.colors.secondary
      }
    });

    var search_module = new SearchModule( {
      markers_collection: state.get( 'markers' )
    } );

    // Append maki icon collection to config
    Config.makiCollection = new MakiCollection();

    /**
     * Event handlers.
     */

    Communicator.mediator.on('map:ready', function() {
      state.fetch();
    });
    Communicator.mediator.on("marker:click", function(m) {
      var detailLayout = new DetailLayout();

      App.flyouts.getRegion('detail').show( detailLayout );

      detailLayout.getRegion('container').show( new DetailView( { model: m } ) );
      detailLayout.getRegion('footer').show( new DetailSettingsView( { model: m } ) );
    });
    Communicator.mediator.on( "all", function( e, a ) {
      // Debugging:
      console.log( "EVENT '" + e + "'", a );
    } );
    Communicator.mediator.on( 'marker:removeModelByCid', function() {
      App.flyouts.getRegion('detail').hideFlyout();
    });


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
        "search": function() {
          var marker_view = new SearchView( {
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

    Config.makiCollection.getPromise().done(function() {
      App.start();
    });

  });

});