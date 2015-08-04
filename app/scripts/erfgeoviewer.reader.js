require([
    'require-config'
  ],
  function ( RequireJSConfig ) {
    'use strict';

    require(['backbone', 'erfgeoviewer.common', 'communicator',
        'views/map', 'views/header', 'views/markers', 'views/detail', 'views/base-map',
        'modules/routeyou/routeyou', 'erfgeoviewer.search',
        'models/layers', 'models/state'],

      function(Backbone, App, Communicator,
               MapView, HeaderView, MarkerAddView, DetailView, BaseMapSelector,
               RouteyouModule, SearchModule,
               LayerCollection, StateModel) {



        App.start();

        /**
         * Layout.
         */
        var layout = new AppLayout();
        layout.render();
        container.show( layout );

        var flyouts = new FlyoutsLayout();
        flyouts.render();
        layout.getRegion('flyout').show( flyouts );

        /**
         * Init.
         */

        // This object will be serialized and used for storing/restoring a map.
        var state = new StateModel({ id: 1 });
        state.fetch();

        var search_module = new SearchModule( {
          markers_collection: state.get( 'markers' )
        } );

        var map_view = new MapView( {
          layout: layout,
          markers: state.get( 'markers' ),
          state: state
        } );

        layout.getRegion( 'content' ).show( map_view );
        layout.getRegion( 'header' ).show( new HeaderView( {
          modalRegion: layout.getRegion('modal'),
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
              flyouts.getRegion( 'right' ).show( marker_view );
            },
            "base": function() {
              flyouts.getRegion( 'bottom' ).show( new BaseMapSelector( {state: state} ) );
            },
            "features": function() {
              console.log( 'features' );
            },
            "routes": function() {
              var marker_view = new RouteyouView();
              flyouts.getRegion( 'right' ).show( marker_view );
            }
          }
        } );
        var router = new Router();

        /**
         * Event handlers.
         */

        Communicator.reqres.on("router:get", function() {
          return router;
        });
        Communicator.mediator.on("map:tile-layer-clicked", function() {
          if (!flyouts.getRegion('detail').hasView() || !flyouts.getRegion('detail').isVisible() ) {
            flyouts.getRegion('right').hideFlyout();
            router.navigate("");
          }
          flyouts.getRegion('bottom').hideFlyout();
          flyouts.getRegion('detail').hideFlyout();
        });
        Communicator.mediator.on("marker:click", function(m) {
          flyouts.getRegion('detail').show( new DetailView( { model: m } ));
        });
        Communicator.mediator.on( "all", function( e, a ) {
          // Debugging:
          console.log( "event: " + e, a );
        } );


      })

  });
