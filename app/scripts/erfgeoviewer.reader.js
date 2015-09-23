require( [
    'require-config'
  ],
  function( RequireJSConfig ) {
    'use strict';

    require( ['backbone', 'erfgeoviewer.common', 'communicator', 'underscore', 'jquery', 'leaflet',
        'views/map', 'views/header.reader', 'views/detail', 'views/legend',
        'plugins/routeyou/routeyou', 'erfgeoviewer.search',
        'models/layers', 'models/state'],

      function( Backbone, App, Communicator, _, $, L,
                MapView, HeaderView, DetailView, LegendView,
                RouteyouModule, SearchModule,
                LayerCollection, StateModel ) {

        console.log('Erfgeoviewer: reader mode.');

        var state;
        var init = function(state, stateData) {

          state.set(stateData);

          // @Todo: Use Backbone for state fetching
          // @Todo: Create default settings object and extend with the data from JSON file

          /**
           * Legend
           */
          if (state.get('mapSettings').showLegend && state.get('mapSettings').legend) {
            Communicator.mediator.on('map:ready', function(map) {
              var legend = L.control({ position: 'bottomleft' });

              legend.onAdd = function (map) {
                // Render legend
                var legendView = new LegendView({ legend: state.get('mapSettings').legend });
                return legendView.render().$el[0];
              };

              legend.addTo(map);
            });
          }

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
