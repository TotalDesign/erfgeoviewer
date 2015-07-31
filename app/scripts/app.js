define( [
    'backbone', 'backbone.marionette', 'communicator', 'velocity',
    'models/layers', 'models/state',
    'views/map', 'views/header', 'views/markers', 'views/layout/flyout', 'views/detail', 'views/base-map',
    'modules/routeyou/routeyou'

    // Search modules
    //,'modules/zev/zev'
    , 'modules/delving/delving'
  ],

  function( Backbone, Marionette, Communicator, $,
            LayerCollection, StateModel,
            MapView, HeaderView, MarkerAddView, FlyoutRegion, DetailView, BaseMapSelector,
            RouteyouModule,
            SearchModule ) {
    'use strict';

    var App = new Marionette.Application();

    var container = new Marionette.Region( {
      el: "#application"
    } );


    App.addInitializer( function() {

      /**
       * Layout.
       */

      // Primary structure for application.
      var AppLayoutView = Marionette.LayoutView.extend( {

        template: _.template(
          '<div id="tooltip"></div>' +
          '<div id="flyout"></div>' +
          '<header id="header"></header>' +
          '<div id="body">' +
          '  <aside id="routeyou"></aside>' +
          '  <article id="content"></article>' +
          '  <aside id="modal"></aside>' +
          '  <div id="map"></div>' +
          '</div>'
        ),

        regions: {
          header: "#header",
          content: "#content",
          modal: "#modal",
          flyout: "#flyout"
        }

      } );

      // Regions for flyout windows. Placed inside flyout region of AppLayout.
      var FlyoutRegions = Marionette.LayoutView.extend( {

        regionClass: FlyoutRegion,

        template: _.template(
          "<div id='flyout-left' class='z-depth-1'></div>" +
          "<div id='flyout-right' class='z-depth-1'></div>" +
          "<div id='flyout-detail' class='z-depth-2'></div>" +
          "<div id='flyout-bottom' class='z-depth-1'></div>"),
        regions: {
          left: "#flyout-left",
          right: "#flyout-right",
          detail: "#flyout-detail",
          bottom: "#flyout-bottom"
        }

      });

      var layout = new AppLayoutView();
      layout.render();
      container.show( layout );

      var flyouts = new FlyoutRegions();
      flyouts.render();
      layout.getRegion('flyout').show( flyouts );

      /**
       * Views.
       */

      // This object will be serialized and used for storing/restoring a map.
      var state = new StateModel();

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
       * Modules.
       */
      var modules = [];

      //modules.push(new RouteyouModule());
      modules.push( new SearchModule( {
        markers_collection: state.get( 'markers' )
      } ) );


      /**
       * Router.
       */
      var Router = Marionette.AppRouter.extend( {
        routes: {
          "": function() {
            //flyouts.getRegion( 'left' ).reset();
            //flyouts.getRegion( 'right' ).reset();
            //flyouts.getRegion( 'bottom' ).reset();
          },
          "markers": function() {
            var marker_view = new MarkerAddView( {
              modules: modules
            } );
            flyouts.getRegion( 'right' ).show( marker_view );
          },
          "base": function() {
            flyouts.getRegion( 'bottom' ).show( new BaseMapSelector( {state: state} ) );
          },
          "features": function() {
            console.log( 'features' );
          }
        }
      } );
      var router = new Router();

      /**
       * Event handlers.
       */
      Communicator.mediator.on("map:tile-layer-clicked", function() {
        if (!flyouts.getRegion('detail').hasView() || !flyouts.getRegion('detail').isVisible() ) {
          flyouts.getRegion('right').hideFlyout();
          router.navigate("");
        }
        flyouts.getRegion('detail').hideFlyout();
      });
      Communicator.mediator.on("marker:click", function(m) {
        flyouts.getRegion('detail').show( new DetailView( { model: m } ));
      });
      Communicator.mediator.on( "all", function( e, a ) {
        // Debugging:
        console.log( "event: " + e, a );
      } );


    } );

    App.on( "start", function() {
      Backbone.history.start();
    } );

    return App;
  } );
