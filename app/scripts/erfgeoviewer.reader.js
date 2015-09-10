require( [
    'require-config'
  ],
  function( RequireJSConfig ) {
    'use strict';

    require( ['backbone', 'erfgeoviewer.common', 'communicator', 'underscore', 'jquery',
        'views/map', 'views/header.reader', 'views/detail',
        'plugins/routeyou/routeyou', 'erfgeoviewer.search',
        'models/layers', 'models/state'],

      function( Backbone, App, Communicator, _, $,
                MapView, HeaderView, DetailView,
                RouteyouModule, SearchModule,
                LayerCollection, StateModel ) {

        console.log('Erfgeoviewer: reader mode.');

        var state;
        var init = function(state, stateData) {


          /**
           * Header.
           */

          if (state.get('title')) {
            App.layout.getRegion( 'header' ).show( new HeaderView( {
              modalRegion: App.layout.getRegion( 'modal' ),
              state: state
            } ) );
          } else {
            $(App.layout.getRegion( 'header' ).el).hide();
          }


          /**
           * Event handlers.
           */
          Communicator.reqres.setHandler("app:get", function() { return App; });
          Communicator.reqres.setHandler("router:get", function() { return App.router; });
          Communicator.mediator.on('map:ready', function() {
            if (stateData) state.parse(stateData);
          });
          Communicator.mediator.on( "marker:click", function( m ) {
            App.flyouts.getRegion( 'detail' ).show( new DetailView( {model: m} ) );
          } );
          Communicator.mediator.on( "all", function( e, a ) {
            // Debugging:
            console.log( "event: " + e, a );
          } );


          /**
           * Router.
           */

          var Router = Marionette.AppRouter.extend( {
            routes: {
              "": function() {
                console.log( 'ErfGeoviewer Home' );
              }
            }
          } );
          App.router = new Router();


          /**
           * Init.
           */

          new RouteyouModule( {state: state} );
          var map_view = new MapView( {
            layout: App.layout,
            state: state
          } );
          App.layout.getRegion( 'content' ).show( map_view );

          App.start();


        };

        // Look for global configuration object.
        if ( typeof erfgeofileDataFile !== "undefined" ) {
          $.ajax(erfgeofileDataFile).done(function(data) {
            state = new StateModel();
            init(state, data);
          });
        } else if ( typeof erfgeoviewerData !== "undefined" ) {
          state = new StateModel();
          init(state, erfgeoviewerData);
        } else {
          state = new StateModel( {id: 1} );
          init(state);
        }


      } );

  } );
