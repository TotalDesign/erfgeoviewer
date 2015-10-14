var erfgeofileDataFile = '/data/erfgeoviewer.json';

require( [
    'require-config'
  ],
  function( RequireJSConfig ) {
    'use strict';

    require( ['backbone', 'erfgeoviewer.common', 'communicator', 'underscore', 'jquery', 'leaflet', 'config', 'q',
        'views/map', 'views/layout/header.layout', 'views/detail', 'views/detail-navigation', 'views/legend', 'views/layout/detail.layout',
        'views/search/search', 'plugins/routeyou/routeyou', 'erfgeoviewer.search',
      'models/layers', 'models/state', 'models/navbar'],

      function( Backbone, App, Communicator, _, $, L, Config, Q,
                MapView, HeaderView, DetailView, DetailNavigationView, LegendView, DetailLayout,
                SearchView, RouteyouModule, SearchModule,
                LayerCollection, State, NavBar ) {

        console.log('Erfgeoviewer: reader mode.');

        var init = function() {

          /**
           * Header.
           */
//          if (State.get('title')) {
//            App.layout.getRegion( 'header' ).show( new HeaderView( {
//              modalRegion: App.layout.getRegion( 'modal' )
//            } ) );
//          } else {
//            $(App.layout.getRegion( 'header' ).el).hide();
//          }

          /**
           * Event handlers.
           */
          Communicator.reqres.setHandler("app:get", function() { return App; });
          Communicator.reqres.setHandler("router:get", function() { return App.router; });
          Communicator.mediator.on('map:ready', function(map) {

            /**
             * Legend
             */
            if (State.getPlugin('map_settings').model.get('showLegend') && State.getPlugin('map_settings').model.get('legend')) {
              var legend = L.control({ position: 'bottomleft' });

              legend.onAdd = function (map) {
                // Render legend
                var legendView = new LegendView({ legend: State.getPlugin('map_settings').model.get('legend') });
                return legendView.render().$el[0];
              };

              legend.addTo(map);
            }
          });
          Communicator.mediator.on( "marker:click", function(m) {
            var detailLayout = new DetailLayout();

            App.flyouts.getRegion('detail').show( detailLayout );

            detailLayout.getRegion('container').show( new DetailView( { model: m } ) );
            detailLayout.getRegion('footer').show( new DetailNavigationView( { model: m } ) );
          });
          Communicator.mediator.on( "all", function( e, a ) {
            // Debugging:
            console.log( "event: " + e, a );
          } );


          /**
           * Router.
           */
          var routes = {
            "": function() {
              console.log( 'ErfGeoviewer Home' );
            }
          };

          if (State.getPlugin('map_settings').model.get('showSearchFilter')) {
            NavBar.addItem('add', {
              fragment: 'search',
              label: 'Zoek',
              weight: 1000
            });

            routes = _.extend(routes, {
              "search": function() {
                var searchModule = new SearchModule({
                  markers_collection: State.getPlugin('geojson_features').collection
                });

                var markerView = new SearchView({
                  searchModule: searchModule
                });

                App.flyouts.getRegion( 'bottom' ).hideFlyout();
                App.flyouts.getRegion( 'right' ).show( markerView );
              }
            });
          }

          var Router = Marionette.AppRouter.extend( {
            routes: routes
          } );
          App.router = new Router();

          Communicator.reqres.setHandler("router:get", function() { return App.router; });


          /**
           * Init.
           */
//          new RouteyouModule( {state: state} );
          App.mode = "reader";
          App.map_view = new MapView({
            layout: App.layout
          });

          App.layout.getRegion( 'content' ).show( App.map_view );
          App.layout.getRegion( 'header' ).show( new HeaderView() );

          App.start();


        };

        State.pluginsInitialized.promise
          .then(function() {
            var d = Q.defer();

            if ( typeof erfgeofileDataFile !== "undefined" ) {
              $.ajax(erfgeofileDataFile).done(function(data) {
                State.set(State.parse(data));
                d.resolve();
              });
            }
            else if ( typeof erfgeoviewerData !== "undefined" ) {
              State.set(State.parse(erfgeoviewerData));
              d.resolve();
            }
            else {
              State.fetch({
                success: d.resolve,
                error: d.resolve // Also resolve on error to prevent unhandled exceptions on empty state
              });
            }

            return d.promise;
          })
          .then(Config.makiCollection.getPromise)
          .done(init);

      } );

  } );
