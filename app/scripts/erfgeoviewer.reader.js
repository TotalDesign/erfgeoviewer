require( [
    'require-config'
  ],
  function( RequireJSConfig ) {
    'use strict';

    require( ['backbone', 'erfgeoviewer.common', 'communicator', 'underscore', 'jquery',
        'views/map', 'views/header.reader', 'views/detail',
        'modules/routeyou/routeyou', 'erfgeoviewer.search',
        'models/layers', 'models/state'],

      function( Backbone, App, Communicator, _, $,
                MapView, HeaderView, DetailView,
                RouteyouModule, SearchModule,
                LayerCollection, StateModel ) {


        console.log('Erfgeoviewer: reader mode.');
        /**
         * Init.
         */

        var init = function(state) {

          if (state.get('title')) {
            App.layout.getRegion( 'header' ).show( new HeaderView( {
              modalRegion: App.layout.getRegion( 'modal' ),
              state: state
            } ) );
          } else {
            $(App.layout.getRegion( 'header' ).el).hide();
          }

          var map_view = new MapView( {
            layout: App.layout,
            markers: state.get( 'markers' ),
            state: state
          } );
          App.layout.getRegion( 'content' ).show( map_view );


          /**
           * Router.
           */

          var Router = Marionette.AppRouter.extend( {
            routes: {
              "": function() {
                console.log( 'Erfgeoviewer Home' );
              }
            }
          } );
          App.router = new Router();

          App.start();

          /**
           * Event handlers.
           */

          Communicator.mediator.on( "marker:click", function( m ) {
            App.flyouts.getRegion( 'detail' ).show( new DetailView( {model: m} ) );
          } );
          Communicator.mediator.on( "all", function( e, a ) {
            // Debugging:
            console.log( "event: " + e, a );
          } );
        };

        // Look for global configuration object.
        var state;
        if ( typeof erfgeofileDataFile !== "undefined" ) {
          $.ajax(erfgeofileDataFile).done(function(data) {
            state = new StateModel( data );
            init(state);
          });
        } else {
          state = new StateModel( {id: 1} );
          init(state);
        }


      } )

  } );
