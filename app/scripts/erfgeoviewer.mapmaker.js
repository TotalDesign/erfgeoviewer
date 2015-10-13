require( [
    'require-config'
  ],
  function() {
  require(['backbone', 'erfgeoviewer.common', 'communicator', 'jquery', 'config', 'q',
    'views/map', 'views/header', 'views/open', 'views/search/search', 'views/settings',
    'views/detail', 'views/detail-settings', 'views/basemap', 'views/publish',  'views/layout/detail.layout',
    'plugins/routeyou/routeyou', 'erfgeoviewer.search',
    'models/layers', 'models/state'],

  function(Backbone, App, Communicator, $, Config, Q,
           MapView, HeaderView, OpenView, SearchView, SettingsView, DetailView, DetailSettingsView, BaseMapSelector, PublishView, DetailLayout,
           RouteyouModule, SearchModule,
           LayerCollection, State) {

    /**
     * Init.
     */
    App.mode = "mapmaker";
    console.log('Erfgeoviewer: mapmaker mode.');

    // This object will be serialized and used for storing/restoring a map.
//    var state = new StateModel({
//      id: 1,
//      mapSettings: {
//        primaryColor: Config.colors.primary,
//        secondaryColor: Config.colors.secondary
//      }
//    });

    /**
     * Event handlers.
     */

    Communicator.mediator.on('map:ready', function() {
//      State.fetch();
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
        "open": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.layout.getRegion( 'modal' ).show(new OpenView());
        },
        "export": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).show(new PublishView());
        },
        "settings": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).show(new SettingsView());
        },
        "search": function() {
          var searchModule = new SearchModule({
            markers_collection: State.getPlugin('geojson_features').collection
          });

          var markerView = new SearchView({
            searchModule: searchModule
          });

          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).show( markerView );
        },
        "base": function() {
          App.flyouts.getRegion( 'bottom' ).show( new BaseMapSelector() );
        }
      }
    } );
    var router = new Router();
    App.router = router;
    Communicator.reqres.setHandler("app:get", function() { return App; });

    /**
     * Optional modules.
     */

//    new RouteyouModule();


    /**
     * Initialize map.
     */
    State.pluginsInitialized.promise
      .then(function() {
        var d = Q.defer();

        State.fetch({
          success: d.resolve,
          error: d.resolve // Also resolve on error to prevent unhandled exceptions on empty state
        });

        return d.promise;
      })
      .then(function() {
        return Config.makiCollection.fetch();
      })
      .done(function() {
        App.map_view = new MapView({
          layout: App.layout
        });

        App.layout.getRegion( 'content' ).show( App.map_view );
        App.layout.getRegion( 'header' ).show(
          new HeaderView({ modalRegion: App.layout.getRegion( 'modal' ) })
        );

        App.start();
      });

  });

});