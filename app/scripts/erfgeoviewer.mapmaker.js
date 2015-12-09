require( [
    'require-config'
  ],
  function() {
  require(['backbone', 'erfgeoviewer.common', 'communicator', 'jquery', 'config', 'q',

    // Views
    'views/map', 'views/layout/header.layout', 'views/new', 'views/open', 'views/search/search', 'views/settings',
    'views/detail', 'views/detail-settings', 'views/publish', 'views/intro/header', 'views/intro/actions', 'views/intro/list',
    'views/layout/detail.layout', 'views/layout/intro.layout',

    // Plugins
    'plugins/routeyou/routeyou', 'erfgeoviewer.search',

    // Models
    'models/layers', 'models/state', 'models/sidenav', 'models/navbar'],

  function(Backbone, App, Communicator, $, Config, Q,

           // Views
           MapView, HeaderView, NewMapView, OpenMapView, SearchView, SettingsView,
           DetailView, DetailSettingsView, PublishView, IntroHeaderView, IntroActionsView, IntroListView,
           DetailLayout, IntroLayout,

           // Plugins
           RouteyouModule, SearchModule,

           // Models
           LayerCollection, State, SideNav, NavBar) {

    /**
     * Init.
     */
    App.mode = "mapmaker";
    App.container.$el.addClass( "mode-" + App.mode );
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
      detailLayout.getRegion('controls').show( new DetailSettingsView( { model: m } ) );
      detailLayout.getRegion('container').show( new DetailView( { model: m } ) );
      //adding this route to the history enables the user to press back to close the detail flyout
      App.router.navigate("detail");
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
    var searchView;
    var Router = Marionette.AppRouter.extend( {
      routes: {
        "": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'right' ).hideFlyout();
          App.flyouts.getRegion( 'detail' ).hideFlyout();
        },
        "new": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'detail' ).hideFlyout();
          App.layout.getRegion( 'modal' ).show(new NewMapView());
        },
        "open": function() {
          App.flyouts.getRegion( 'bottom' ).hideFlyout();
          App.flyouts.getRegion( 'detail' ).hideFlyout();
          App.layout.getRegion( 'modal' ).show(new OpenMapView());
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

          if (!searchView || searchView.isDestroyed) {
            searchView = new SearchView({ searchModule: searchModule });
          }
          //App.flyouts.getRegion( 'bottom' ).hideFlyout();

          if (App.flyouts.getRegion( 'right' ).hasView(searchView)) {
            App.flyouts.getRegion( 'right' ).expand();
          }
          App.flyouts.getRegion( 'right' ).show( searchView );
        }
      }
    } );
    App.router = new Router();
    Communicator.reqres.setHandler("app:get", function() { return App; });

    /**
     * Optional modules.
     */

    SideNav.addItem('new_map', {
      fragment: 'new',
      icon: 'map',
      label: 'Nieuwe kaart'
    });

    SideNav.addItem('open_map', {
      fragment: 'open',
      icon: 'folder-open-empty',
      label: 'Open'
    });

    NavBar.addItem('save', {
      fragment: 'export',
      label: 'Exporteer',
      weight: 900
    });

    NavBar.addItem('add', {
      fragment: 'search',
      label: 'Zoek',
      weight: 1000
    });

//    new RouteyouModule();


    /**
     * Initialize map.
     */
    State.pluginsInitialized.promise
      .then(function() {
        var d = Q.defer();

        State.fetch({
          success: d.resolve,
          error: function() {
            App.layout.getRegion( 'modal' ).show( IntroLayout );

            IntroLayout.getRegion( 'header' ).show( new IntroHeaderView() );
            IntroLayout.getRegion( 'content' ).show( new IntroActionsView() );
            IntroLayout.getRegion( 'footer' ).show( new IntroListView() );

            d.resolve(); // Also resolve on error to prevent unhandled exceptions on empty state
          }
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
        App.layout.getRegion( 'header' ).show( new HeaderView() );

        App.start();
      });

  });

});