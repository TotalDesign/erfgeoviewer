define( [
    'backbone', 'backbone.marionette', 'communicator', 'velocity',
    'models/layers', 'models/markers',
    'views/map', 'views/header', 'views/markers', 'views/detail-slideout',
    'modules/routeyou/routeyou'

    // Search modules
    //,'modules/zev/zev'
    , 'modules/delving/delving'
  ],

  function( Backbone, Marionette, Communicator, $,
            LayerCollection, MarkerCollection,
            MapView, HeaderView, MarkerAddView, DetailSlideoutView,
            RouteyouModule,
            SearchModule ) {
    'use strict';

    var App = new Marionette.Application();

    var container = new Marionette.Region( {
      el: "#application"
    } );


    App.addInitializer( function() {

      /**
       * Layout
       */
      var AppLayoutView = Marionette.LayoutView.extend( {
        template: "#template-layout",
        regions: {
          header: "#header",
          content: "#content",
          modal: "#modal",
          layerAdd: "#layer-add",
          details: "#details"
        }
      } );

      var layout = new AppLayoutView();
      layout.render();
      container.show( layout );

      // This object will be serialized and used for storing/restoring a map.
      var state = new Backbone.Model( {
        'markers': new MarkerCollection()
      } );

      var map_view = new MapView( {
        layout: layout,
        markers: state.get( 'markers' )
      } );
      layout.getRegion( 'content' ).show( map_view );
      layout.getRegion( 'header' ).show( new HeaderView( {
        modalRegion: layout.getRegion('modal'),
        state: state
      } ) );
      layout.getRegion( 'details' ).show( new DetailSlideoutView() );

      Communicator.mediator.on( "all", function( e, a ) {
        console.log( "event", e );
      } );

      /**
       * Modules
       */
      var modules = [];

      //modules.push(new RouteyouModule());
      modules.push( new SearchModule( {
        markers_collection: state.get( 'markers' )
      } ) );


      /**
       * Routes
       */
      var Router = Marionette.AppRouter.extend( {
        routes: {
          "": function() {
            layout.getRegion( 'layerAdd' ).reset();
          },
          "markers": function() {
            console.log( 'route:markers' );
            layout.getRegion( 'layerAdd' ).show(
              new MarkerAddView( {
                modules: modules
              } )
            );
          },
          "base": function() {
            console.log( 'base' );
          },
          "features": function() {
            console.log( 'features' );
          }
        }
      } );
      new Router();

    } );

    App.on( "start", function() {
      Backbone.history.start();
    } );

    return App;
  } );
